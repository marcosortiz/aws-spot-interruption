require 'aws-sdk-dynamodb'

module Ddb
    class SpotFleetRequest

        DEFAULT_TABLE_NAME = 'SpotFleetRequests'

        def initialize(opts={})
            @client  = Aws::DynamoDB::Client.new
            @table_name = opts[:table_name] || DEFAULT_TABLE_NAME
        end

        def search_sfr
            resp = @client.scan({
                table_name: @table_name, 
            })

            resp.items
        end

    end
end
