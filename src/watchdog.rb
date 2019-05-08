# /usr/bin/ruby

require 'logger'
require 'net/http'
require 'socket'
require 'time'

LOG_FILE = '/home/ssm-user/watchdog.log'
STOP_MSG = 'stop'
PORT = 8124
@logger = Logger.new(LOG_FILE)
@logger.formatter = proc do |severity, datetime, progname, msg|
    "#{datetime.strftime('%Y-%m-%dT%H:%M:%S.%6N')} #{severity} #{msg}\n"
end

def send_stop_msg(ip, port)
    TCPSocket.open(ip, port) {|s|
        s.send "stop", 0
        resp = s.recv(2)
    }
end


while true do
    @logger.info('No termination notice detected.')
    now = Time.now
    resp =  Net::HTTP.get(URI('http://169.254.169.254/latest/meta-data/spot/termination-time'))
    t = Time.parse(resp) rescue nil

    if t.nil?
        sleep(5)
    else
        @logger.info "This instance will be terminated at #{t}."
        @logger.info "I have #{t-now} seconds to save my state and stop any activity."
        break
    end
end

send_stop_msg('localhost', PORT)
@logger.info "Done saving state. Stopping now. Bye."