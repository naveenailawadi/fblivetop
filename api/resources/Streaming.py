from flask_restful import Resource
from api.resources import load_json, validate_user_token, validate_admin_token
from api.FacebookStreamer import StreamBot
from api.models import StreamerModel, db
from datetime import datetime as dt


class StreamingResource(Resource):
	# create a psot method to start streaming.  
	def post(self):
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
		message, code = validate_user_token(token)

		# return the errors if applicable
		if code >= 400:
			return message, code

		# else, get the available streamers
		available_streamers = StreamerModel.filter_by(active=False).limit(streamer_count).all()
		available_streamer_count = len(available_streamers)

		# if the limit is not reached, return so (indicating the user to decrease it)
		if available_streamer_count < streamer_count:
			return {'message': 'insufficient streamers available', 'availableStreamers': available_streamer_count}, 409

		# create a streamer for all of them and start running it --> use a for loop to start streaming immediately
		proc = []
		for streamer in available_streamers:
		    # start them
		    p = Process(target=self.start_stream, args=(streamer, ))
		    p.start()
		    proc.append(p)

		for p in proc:
		    p.join()

		return {'status': 'success'}, 201
		


	def start_stream(self, stream_model, stream_link, timeout):
		# initialize the streamer with the proxy (if applicable)
		if stream_model.proxy:
			streamer = StreamBot(stream_model.proxy_dict())
		else:
			streamer = StreamBot()

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


# create a resource for craeting streamers --> admin access only
class StreamerManagementResource(Resource):
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

		# else add the streamer
		new_streamer = StreamerModel(host=host, port=port, email=email, email_password=email_password,
									proxy_username=proxy_username, proxy_password=proxy_username)

		db.session.add(new_streamer)
		db.session.commit()

		return {'status': 'success', 'message': f"added streamer on {host}:{port} under account {email}"}, 201
















