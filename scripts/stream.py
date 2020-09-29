from FacebookStreamer import StreamBot
from selenium.common.exceptions import NoSuchElementException
from multiprocessing import Process
from socket import timeout as TimeOutError
import json
import time

# import the constants from a config file
with open('config.json', 'r') as infile:
    info = json.loads(infile.read())

    # load the constants from the file
    WAIT_INCREMENT = info['wait_increment']
    DEFAULT_SLEEP_SPACING = info['default_sleep_spacing']
    HIDDEN_BROWSERS = info['hidden_browsers']

    # load the accounts
    ACCOUNTS = info['accounts']


# create a list to manage all the opened streamers and bad accounts
open_streamers = []
bad_accounts = []


# make a function to initialize the streamers with the proxy (if applicable)
def run(stream_link, account, timeout):
    try:
        streamer = StreamBot(
            proxy=account['proxy'], wait_increment=WAIT_INCREMENT, headless=HIDDEN_BROWSERS)
    except KeyError:
        streamer = StreamBot(wait_increment=WAIT_INCREMENT, headless=HIDDEN_BROWSERS)

    try:
        # login
        active = streamer.login(account['email'], account['password'])

        if active:
            print(f"\nOpened {account['email']}")
            open_streamers.append(streamer)

            # start streaming (and except os errors)
            try:
                streamer.stream(stream_link, timeout)
            except OSError:
                pass
            except TimeOutError:
                pass
        else:
            bad_accounts.append(streamer)
    except NoSuchElementException:
        print(f"Failed to open streamer with {account['email']}")
        bad_accounts.append(account)
        open


if __name__ == '__main__':
    # Primarily: get the streaming link
    stream_link = input('Stream Link: ')
    end_stream = 60 * float(input('Streaming minutes: '))
    print('\n')

    # start the processes
    proc = []
    for account in ACCOUNTS:
        p = Process(target=run, args=(stream_link, account, end_stream, ))
        p.start()

        proc.append(p)

        # sleep if applicable
        try:
            time.sleep(account['sleep_spacing'])
        except KeyError:
            time.sleep(DEFAULT_SLEEP_SPACING)

    start = time.time()

    # join the processes
    for p in proc:
        p.join()

    print(f"{len(ACCOUNTS) - len(bad_accounts)} streamers are running")
    print(f"Bad Accounts: \n{json.dumps(bad_accounts, indent=4)}")

    # run perpetually
    count = time.time() - start
    while True:
        try:
            time.sleep(10)
            count += 10
        except KeyboardInterrupt:
            print('\nClosing streamers...')

            for streamer in open_streamers:
                streamer.quit()
            break

        # break on
        if count >= end_stream:
            break
        else:
            print(f"{count} out of {end_stream} seconds have elapsed")

    print('Everything is closed!')
