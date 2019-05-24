require 'json'
require_relative '../sqs/workloads'

module Lambda
    class GetWorkloadInitialState

        @@workloads = Sqs::Workloads.new( queue_url: ENV['WORKLOADS_QUEUE_URL'])

        def self.lambda_handler(event:, context:)
            msg = @@workloads.pop
            if (msg)
                return msg
            else
                return {}
            end
        end
        
    end
end