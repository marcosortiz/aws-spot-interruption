require 'aws-sdk-dynamodb'

module Ddb
    class Workload

        DEFAULT_TABLE_NAME = 'SpotFleetRequests'

        def initialize(opts={})
            @client  = Aws::DynamoDB::Client.new
            @table_name = opts[:table_name] || DEFAULT_TABLE_NAME
        end

        def scan
            resp = @client.scan({
                table_name: @table_name, 
            })

            resp.items
        end

        def updateItem(params={})
            resp = @client.update_item({
                expression_attribute_names: {
                    "#NA" => "notifiedAt",
                    "#MD"  => "metadataDelay"
                }, 
                expression_attribute_values: {
                    ":na" => params['notified_at'],
                    ":md" => params['delay'],
                }, 
                key: {
                    "id" => params['id'],
                    "instanceId" => params['instanceId'],
                }, 
                return_values: "ALL_NEW", 
                table_name: @table_name,
                update_expression: "SET #NA = :na, #MD = :md", 
            })
        end

        def updateProgress(params={})
            resp = @client.update_item({
                expression_attribute_names: {
                    "#P" => "progress",
                }, 
                expression_attribute_values: {
                    ":p" => params['progress'],
                }, 
                key: {
                    "id" => params['id'],
                    "instanceId" => params['instanceId'],
                }, 
                return_values: "ALL_NEW", 
                table_name: @table_name,
                update_expression: "SET #P = :p", 
            })
        end


    end
end
