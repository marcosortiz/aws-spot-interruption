require 'base64'
require 'json'
require 'stringio'
require 'zlib'
require_relative '../ddb/spot_fleet_request'
require_relative '../ddb/spot_interruption'
require_relative '../sqs/workloads'


module Lambda
    class RecordProgress
        @@sfr = Ddb::SpotFleetRequest.new( table_name: ENV['SFR_TABLE_NAME'])
        @@si =  Ddb::SpotInterruption.new( table_name: ENV['INTERRUPTIONS_TABLE_NAME'])
        @@workloads = Sqs::Workloads.new( queue_url: ENV['WORKLOADS_QUEUE_URL'])

        def self.lambda_handler(event:, context:)
            data = event['awslogs']['data']
            decoded_payload = Zlib::GzipReader.new(StringIO.new(Base64.decode64(data))).read
            hash = JSON.parse(decoded_payload)

            sfr_id = @@sfr.search_sfr.first['id']
            log_lines = hash['logEvents'].each do |line|
                instanceId = line['extractedFields']['instanceId']
                workloadId = line['extractedFields']['workloadId']
                progress = line['extractedFields']['value']
                level = line['extractedFields']['level']

                if level == 'PROGRESS'
                    params = {
                        'sfrId' => sfr_id,
                        'instanceId' => instanceId,
                        'workloadId' => workloadId,
                        'progress' => progress,
                    }
                    puts "updateProgress: #{params}"
                    @@si.updateProgress(params)
                elsif level == 'SAVING_PROGRESS'
                    params = {
                        'sfrId' => sfr_id,
                        'instanceId' => instanceId,
                        'workloadId' => workloadId,
                        'progress' => progress,
                    }
                    puts "updateProgress: #{params}"
                    @@si.updateProgress(params)
                    msg = {id: workloadId, progress: progress}.to_json
                    puts "push: #{msg}"
                    @@workloads.push(msg)
                end
            end
        end
        
    end
end