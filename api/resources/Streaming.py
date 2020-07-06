from flask_restful import Resource
from api.resources import load_json, validate_user_token, validate_admin_token, load_header_token
from api.FacebookStreamer import StreamBot
from api.models import StreamerModel, UserModel, db, object_as_dict, update_obj, get_float_constant
from datetime import datetime as dt
from multiprocessing import Process


class StreamingResource(Resource):
    # create a get method to find how manny streamers are available
    def get(self):
        # no sensitive data --> no need to check the token
        min_streamers = get_float_constant('minimum_capacity')
        max_streamers = get_float_constant('maximum_capacity')

        return {'status': 'success', 'minimumCapacity': min_streamers, 'maximumCapacity': max_streamers}, 201

    # create a post method to get the cost
    def post(self):
        # use a token (proprietary formula)
        data = load_json()

        # take out the necessary stuff
        try:
            token = data['token']
            streamer_count = data['streamerCount']
            stream_time = data['streamTime']
        except KeyError:
            return {'message': 'request must include token, streamerCount, and streamTime'}, 422

        # validate the token
        privileges, code = validate_user_token(token)

        # return the errors if applicable
        if code >= 400:
            return privileges, code

        # else get the active streamers
        available_streamer_count = len(
            self.get_available_streamers(streamer_count))

        # get how much it would cost
        cost = self.calculate_cost(stream_time, streamer_count)

        # check if the user has sufficient funds
        balance = UserModel.query.filter_by(
            id=privileges['id']).first().balance
        if balance < cost:
            sufficient_funds = False
        else:
            sufficient_funds = True

        return {'status': 'success', 'balance': balance, 'cost': cost,
                'available_streamers': available_streamer_count, 'sufficient_funds': sufficient_funds}, 201

    # create a put method to start streaming.

    def put(self):
        # get the user data
        data = load_json()

        # take out the necessary stuff
        try:
            token = data['token']
            streamer_count = data['streamerCount']
            stream_time = data['streamTime']
            stream_url = data['streamUrl']
        except KeyError:
            return {'message': 'request must include token, streamerCount, streamTime, and streamUrl'}, 422

        # validate the token
        privileges, code = validate_user_token(token)

        # return the errors if applicable
        if code >= 400:
            return privileges, code

        # check if everything is good
        user, code = self.check_availability(
            streamer_count, stream_time, privileges['id'])
        if code >= 400:
            return user, code

        # else, charge them
        cost = self.calculate_cost(stream_time, streamer_count)
        user.balance -= cost
        db.session.commit()

        # create a streamer for all of them and start running it --> use a for loop to start streaming immediately
        available_streamers = self.get_available_streamers(streamer_count)
        proc = []
        for streamer in available_streamers:
            # start them
            p = Process(target=self.start_stream, args=(
                streamer, stream_url, stream_time, ))
            p.start()
            proc.append(p)

        for p in proc:
            p.join()

        return {'status': 'success'}, 201

    def start_stream(self, stream_model, stream_link, timeout):
        # initialize the streamer with the proxy (if applicable)
        streamer = StreamBot(stream_model.proxy_dict())

        # make stream model active and change last activity date
        stream_model.active = True
        stream_model.previous_activity_date = dt.now()
        db.session.commit()

        # login
        streamer.login(stream_model.email, stream_model.email_password)

        # start streaming
        streamer.stream(stream_link, timeout)

        # set the stream model to inactiveactive again
        stream_model.active = False
        db.session.commit()

    def calculate_cost(self, time, streamers):
        # convert the time to minutes
        minutes = time / 60

        # get the constants
        bot_dollar = get_float_constant('bot_dollar')
        minute_multiplier = get_float_constant('minute_multiplier')

        # multiply it out
        cost = (streamers * bot_dollar) * (minutes * minute_multiplier)

        return cost

    def check_availability(self, streamer_count, stream_time, user_id):
        # else, get the available streamers
        available_streamer_count = len(self.get_available_streamers(
            streamer_count))

        # check the mins and maxes
        min_streamers = get_float_constant('minimum_capacity')
        max_streamers = get_float_constant('maximum_capacity')
        if streamer_count > max_streamers:
            return {'message': f"cannot exceed {max_streamers} streamers"}, 409
        elif streamer_count < min_streamers:
            return {'message': f"must use at least {min_streamers} streamers"}, 409

        # if the limit is not reached, return so (indicating the user to decrease it)
        if available_streamer_count < streamer_count:
            return {'message': 'insufficient streamers available', 'availableStreamers': available_streamer_count}, 409

        # charge the user
        cost = self.calculate_cost(stream_time, streamer_count)
        user = UserModel.query.filter_by(id=user_id).first()
        balance = user.balance

        if balance < cost:
            return {'message': f"insufficient funds ({abs(balance - cost)})", 'cost': cost, 'balance': balance}, 402

        # else return the user
        return user, 201

    def get_available_streamers(self, streamer_count):
        available_streamers = StreamerModel.query.filter_by(
            active=False).limit(streamer_count).all()
        return available_streamers


# create a resource for craeting streamers --> admin access only
class StreamerManagementResource(Resource):
    # create an endpoint for getting all the available streamers
    def get(self):
        token = load_header_token()

        privileges, code = validate_admin_token(token)

        if code >= 400:
            return privileges, code

        # else get all the data
        streamers_raw = StreamerModel.query.all()

        # format the streamers raw into a viable dictionary
        streamer_dicts = [object_as_dict(streamer)
                          for streamer in streamers_raw]

        return {'status': 'success', 'streamers': streamer_dicts}, 201

    # create an endpoint for adding a streamer
    def post(self):
        # validate the data
        data = load_json()

        # get the right stuff out
        try:
            token = data['token']

            email = data['email']
            email_password = data['emailPassword']

            host = data['host']
            port = data['port']

            proxy_username = data['proxyUsername']
            proxy_password = data['proxyPassword']

        except KeyError:
            return {'message': 'must include: token, host, port, email, emailPassword, proxyUsername, proxyPassword'}, 422

        # validate the admin
        privileges, code = validate_admin_token(token)

        # return a code if invalid
        if code >= 400:
            return privileges, code

        # check if the streamer exists (email must be unique)
        test_streamer = StreamerModel.query.filter_by(email=email).first()
        if test_streamer:
            # set object as inactive
            update_obj(test_streamer, dict(host=host, port=port, email=email, email_password=email_password,
                                           proxy_username=proxy_username, proxy_password=proxy_password, active=False))
            message = {'status': 'success',
                       'message': f"updated streamer on {host}:{port} under account {email}"}
        else:
            # else add the streamer (email same as username)
            new_streamer = StreamerModel(host=host, port=port, email=email, email_password=email_password,
                                         proxy_username=proxy_username, proxy_password=proxy_password)

            db.session.add(new_streamer)
            message = {'status': 'success',
                       'message': f"added streamer on {host}:{port} under account {email}"}

        db.session.commit()

        return message, 201
