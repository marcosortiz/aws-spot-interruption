require 'json'
require 'aws-sdk-sqs'

module Sqs
    class Workloads

        DEFAULT_QUEUE_NAME = 'InterruptedWorkloads'
        MESSAGE_GROUP_ID = 'spot-demo-interrupted-workloads'

        def initialize(opts={})
            @client  = Aws::SQS::Client.new
            @queue_url = opts[:queue_url] || DEFAULT_QUEUE_NAME
        end

        def push(message)
            resp = @client.send_message({
                queue_url: @queue_url,
                message_body: message,
                message_group_id: MESSAGE_GROUP_ID,
            })
        end

        def pop
            resp = receive_message
            msg = nil
            resp.messages.each do |msg|
                receipt_handle = msg[:receipt_handle]            
                msg = JSON.parse(msg[:body])
                delete_message(receipt_handle)
                return msg
            end
            return msg
        end

        private

        def receive_message
            resp = @client.receive_message({
                queue_url: @queue_url,
                max_number_of_messages: 1,
                attribute_names: ["All"],
                visibility_timeout: 3,
                wait_time_seconds: 3,
            })
        end

        def delete_message(receipt_handle)
            resp = @client.delete_message({
                queue_url: @queue_url,
                receipt_handle: receipt_handle,
            })
        end
        
    end
end
