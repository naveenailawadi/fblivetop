import pandas as pd
import json


# create a class to merge the open accounts
class Merger:
    def __init__(self, accounts_csv, proxies_csv):
        # load the data from the each csv
        self.accounts_csv = accounts_csv
        self.proxies_csv = proxies_csv

        self.accounts_df = pd.read_csv(accounts_csv, header=0)
        self.proxies_df = pd.read_csv(proxies_csv, header=0)

        accounts_len = len(self.accounts_df)
        proxies_len = len(self.proxies_df)

        # merge both dataframes into 1 by putting them next to each other

        # find the lesser of the two and convert them to a merged df
        if accounts_len > proxies_len:
            self.merged_df = pd.concat([self.accounts_df[:proxies_len], self.proxies_df], axis=1)
        else:
            self.merged_df = pd.concat([self.accounts_df, self.proxies_df[:accounts_len]], axis=1)

    # create a function to merge the 2 dfs into a json
    def to_json(self, output_json):
        # get the json's current data
        data = json.loads(open(output_json, 'r').read())

        # get the accounts information
        accounts = data['accounts']

        # create a record for each row in the dataframe
        added_accounts = 0
        for index, row in self.merged_df.iterrows():
            obj = self.merged_df.loc[index]

            # create a dictionary
            new_record = {
                'email': obj['email'],
                'password': obj['email_password'],
                'proxy':
                    {
                    'host': str(obj['host']),
                    'port': str(obj['port']),
                    'username': obj['username'],
                    'password': obj['proxy_password']}
            }

            # add the dictionary to the accounts list
            if not (new_record in accounts):
                accounts.append(new_record)

            added_accounts += 1

        # rewrite to the json
        data['accounts'] = accounts
        with open(output_json, 'w') as outfile:
            outfile.write(json.dumps(data, indent=4))

        # remove them from the old file
        self.accounts_df[added_accounts:].to_csv(accounts_csv, index=False)
        self.proxies_df[added_accounts:].to_csv(proxies_csv, index=False)


if __name__ == '__main__':
    accounts_csv = 'OpenAccs.txt'
    proxies_csv = 'OpenProxies.txt'

    merger = Merger(accounts_csv, proxies_csv)

    # output to the json
    merger.to_json('config.json')
