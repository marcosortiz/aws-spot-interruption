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
                    "#II" => "instanceId",
                },
                expression_attribute_values: {
                    ":sa" => params['value'],
                    ":ii" => params['instanceId'],
                },
                key: {
                    "id" => params['workloadId'],
                },
                return_values: "ALL_NEW",
                table_name: @table_name,
                update_expression: "SET #SA = :sa, #II = :ii",
            })
        end

        def record_resumed_from(params={})
            resp = @client.update_item({
                expression_attribute_names: {
                    "#RF" => "resumedFrom",
                    "#II" => "instanceId",
                },
                expression_attribute_values: {
                    ":rf" => params['value'],
                    ":ii" => params['instanceId'],
                },
                key: {
                    "id" => params['workloadId'],
                },
                return_values: "ALL_NEW",
                table_name: @table_name,
                update_expression: "SET #RF = :rf, #II = :ii",
            })
        end

        def record_progress(params={})
            resp = @client.update_item({
                expression_attribute_names: {
                    "#P" => "progress",
                    "#II" => "instanceId",
                }, 
                expression_attribute_values: {
                    ":p" => params['value'],
                    ":ii" => params['instanceId'],
                }, 
                key: {
                    "id" => params['workloadId'],
                }, 
                return_values: "ALL_NEW", 
                table_name: @table_name,
                update_expression: "SET #P = :p, #II = :ii", 
            })
        end

        def record_metadata_notified_at(params={})
            recorded_at = Time.parse(params['recorded_at'])
            notified_at = Time.parse(params['value'])-120
            delay = (recorded_at - notified_at).round(2)
            resp = @client.update_item({
                expression_attribute_names: {
                    "#NA" => "notifiedAt",
                    "#MD"  => "metadataDelay",
                    "#II" => "instanceId",
                }, 
                expression_attribute_values: {
                    ":na" => notified_at.utc.xmlschema,
                    ":md" => delay.to_s,
                    ":ii" => params['instanceId'],
                }, 
                key: {
                    "id" => params['workloadId'],
                }, 
                return_values: "ALL_NEW", 
                table_name: @table_name,
                update_expression: "SET #NA = :na, #MD = :md, #II = :ii", 
            })
        end

        def record_finished_at(params={})
            resp = @client.update_item({
                expression_attribute_names: {
                    "#FA" => "finishedAt",
                    "#II" => "instanceId",
                },
                expression_attribute_values: {
                    ":fa" => params['value'],
                    ":ii" => params['instanceId'],
                },
                key: {
                    "id" => params['workloadId'],
                },
                return_values: "ALL_NEW",
                table_name: @table_name,
                update_expression: "SET #FA = :fa, #II = :ii",
            })
        end

        def query
            resp = @client.scan({
                table_name: @table_name,
            })

            resp.items.sort_by { |h| h['id'] }
        end

    end
end
