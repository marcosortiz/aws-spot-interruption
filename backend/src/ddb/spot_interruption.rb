require 'aws-sdk-dynamodb'

module Ddb
    class SpotInterruption

        DEFAULT_TABLE_NAME = 'SpotInterruptions'

        def initialize(opts={})
            @client  = Aws::DynamoDB::Client.new
            @table_name = opts[:table_name] || DEFAULT_TABLE_NAME
        end

        def getInterruptions(sfr_id)
            resp = @client.query({
                expression_attribute_values: {
                    ":v1" => sfr_id, 
                  }, 
                key_condition_expression: "sfrId = :v1",
                table_name: @table_name, 
            })

            resp.items
        end

        def updateItem(params={})
            resp = @client.update_item({
                expression_attribute_names: {
                    "#NA" => "notifiedAt",
                    "#LD"  => "lambdaDelay"
                }, 
                expression_attribute_values: {
                    ":na" => params['notified_at'],
                    ":ld" => params['lambda_delay'],
                }, 
                key: {
                    "sfrId" => params['sfrId'],
                    "instanceId" => params['instanceId'],
                }, 
                return_values: "ALL_NEW", 
                table_name: @table_name,
                update_expression: "SET #NA = :na, #LD = :ld", 
            })
        end

        def updateProgress(params={})
            resp = @client.update_item({
                expression_attribute_names: {
                    "#P" => "progress",
                    "#WI" => "workloadId",
                }, 
                expression_attribute_values: {
                    ":p" => params['progress'],
                    ":wi" => params['workloadId']
                }, 
                key: {
                    "sfrId" => params['sfrId'],
                    "instanceId" => params['instanceId'],
                }, 
                return_values: "ALL_NEW", 
                table_name: @table_name,
                update_expression: "SET #P = :p, #WI = :wi", 
            })
        end

    end
end
