require 'json'
require 'time'
require_relative '../ddb/spot_fleet_request'
require_relative '../ddb/spot_interruption'

module Lambda
    class RecordInterruption
        @@sfr = Ddb::SpotFleetRequest.new( table_name: ENV['SFR_TABLE_NAME'])
        @@si =  Ddb::SpotInterruption.new( table_name: ENV['INTERRUPTIONS_TABLE_NAME'])
        @@ddb = Aws::DynamoDB::Client.new

        def self.lambda_handler(event:, context:)
            now = Time.now
            puts event

            sfr_id = @@sfr.search_sfr.first['id']
            notified_at = event['time']
            params = {
                'sfrId' => sfr_id,
                'instanceId' => event['detail']['instance-id'],
                'notified_at' => notified_at,
                'lambda_delay' => (now - Time.parse(notified_at)).round(6),
            }
            puts params
            resp = @@si.updateItem(params)
            return resp
        end
        
    end
end