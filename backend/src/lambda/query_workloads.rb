require_relative '../ddb/workload'


module Lambda
    class QueryWorkloads

        @@w = Ddb::Workload.new( table_name: ENV['TABLE_NAME'])

        def self.lambda_handler(event:, context:)
            @@w.query
        end
        
    end
end