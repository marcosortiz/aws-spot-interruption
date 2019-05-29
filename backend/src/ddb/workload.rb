require 'time'
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

        def record_started_at(params={})
            resp = @client.update_item({
                expression_attribute_names: {
                    "#SA" => "startedAt",
                },
                expression_attribute_values: {
                    ":sa" => params['value'],
                },
                key: {
                    "id" => params['workloadId'],
                    "instanceId" => params['instanceId'],
                },
                return_values: "ALL_NEW",
                table_name: @table_name,
                update_expression: "SET #SA = :sa",
            })
        end

        def record_resumed_from(params={})
            resp = @client.update_item({
                expression_attribute_names: {
                    "#RF" => "resumedFrom",
                },
                expression_attribute_values: {
                    ":rf" => params['value'],
                },
                key: {
                    "id" => params['workloadId'],
                    "instanceId" => params['instanceId'],
                },
                return_values: "ALL_NEW",
                table_name: @table_name,
                update_expression: "SET #RF = :rf",
            })
        end

        def record_progress(params={})
            resp = @client.update_item({
                expression_attribute_names: {
                    "#P" => "progress",
                }, 
                expression_attribute_values: {
                    ":p" => params['value'],
                }, 
                key: {
                    "id" => params['workloadId'],
                    "instanceId" => params['instanceId'],
                }, 
                return_values: "ALL_NEW", 
                table_name: @table_name,
                update_expression: "SET #P = :p", 
            })
        end

        def record_metadata_notified_at(params={})
            recorded_at = Time.parse(params['recorded_at'])
            notified_at = Time.parse(params['value'])-120
            delay = (recorded_at - notified_at).round(2)
            resp = @client.update_item({
                expression_attribute_names: {
                    "#NA" => "notifiedAt",
                    "#MD"  => "metadataDelay"
                }, 
                expression_attribute_values: {
                    ":na" => params['value'],
                    ":md" => delay.to_s,
                }, 
                key: {
                    "id" => params['workloadId'],
                    "instanceId" => params['instanceId'],
                }, 
                return_values: "ALL_NEW", 
                table_name: @table_name,
                update_expression: "SET #NA = :na, #MD = :md", 
            })
        end

        def record_finished_at(params={})
            resp = @client.update_item({
                expression_attribute_names: {
                    "#FA" => "finishedAt",
                },
                expression_attribute_values: {
                    ":fa" => params['value'],
                },
                key: {
                    "id" => params['workloadId'],
                    "instanceId" => params['instanceId'],
                },
                return_values: "ALL_NEW",
                table_name: @table_name,
                update_expression: "SET #FA = :fa",
            })
        end

        def query
            resp = @client.scan({
                table_name: @table_name, 
            })

            resp.items
        end

    end
end
