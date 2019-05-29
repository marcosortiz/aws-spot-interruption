require 'base64'
require 'json'
require 'stringio'
require 'zlib'
require_relative '../core/event_handler'

module Lambda
    class HandleWorkloadEvents
        opts ={
            table_name: ENV['TABLE_NAME'],
            queue_url: ENV['QUEUE_URL'],
        }
        @@handler = Core::EventHandler.new(opts)

        def self.lambda_handler(event:, context:)
            data = event['awslogs']['data']
            decoded_payload = Zlib::GzipReader.new(StringIO.new(Base64.decode64(data))).read
            hash = JSON.parse(decoded_payload)
            log_lines = hash['logEvents'].each do |line|
                event = line['extractedFields']
                puts "Event: #{event}"
                @@handler.handle(event)
            end
        end
    end
end