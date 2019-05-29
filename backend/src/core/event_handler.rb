require_relative '../ddb/workload'
require_relative '../sqs/workloads'

module Core
    class EventHandler

        STARTED_AT_EVENT      = 'STARTED_AT'
        RESUMED_FROM_EVENT    = 'RESUMED_FROM'
        PROGRESS_EVENT        = 'PROGRESS'
        NOTIFIED_AT_EVENT     = 'NOTIFIED_AT'
        SAVING_PROGRESS_EVENT = 'SAVING_PROGRESS'
        FINISHED_AT_EVENT     = 'FINISHED_AT'

        def initialize(opts={})
            @ddb = Ddb::Workload.new(opts)
            @sqs = Sqs::Workloads.new(opts)
        end

        def handle(event)
            if event['level'] == PROGRESS_EVENT || event['level'] == SAVING_PROGRESS_EVENT
                @ddb.record_progress(event)
                if event['level'] == SAVING_PROGRESS_EVENT && (event['value'].to_f.round(2)) < 100.00
                    msg = {id: event['workloadId'], progress: event['value']}.to_json
                    @sqs.push(msg)
                end
            elsif event['level'] == STARTED_AT_EVENT
                @ddb.record_started_at(event)
            elsif event['level'] == RESUMED_FROM_EVENT
                @ddb.record_resumed_from(event)
            elsif event['level'] == NOTIFIED_AT_EVENT
                @ddb.record_metadata_notified_at(event)
            elsif event['level'] == FINISHED_AT_EVENT
                @ddb.record_finished_at(event)
            end
        end

    end
end