require_relative '../ddb/spot_interruption'


module Lambda
    class QueryWorkloads

        @@si = Ddb::SpotInterruption.new( table_name: ENV['TABLE_NAME'])

        def self.lambda_handler(event:, context:)
            @@si.getInterruptions(event['sfrId'])
        end
        
    end
end