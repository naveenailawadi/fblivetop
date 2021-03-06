from flask_restful import Api
from api import app
from api.resources.User import UserManagementResource, LoginResource
from api.resources.Admin import AdminUserManagementResource, AdminLoginResource
from api.resources.Streaming import StreamingResource, StreamerManagementResource
from api.resources.Constants import FloatConstantResource


# reroute traffic
@app.route('/')
def root_page():
    return('<a href="http://fblivetop.com">Main Site</a>')


# create an api
api = Api(app)

# user routes
api.add_resource(UserManagementResource, '/UserManagement')
api.add_resource(LoginResource, '/Login')

# admin routes
api.add_resource(AdminUserManagementResource, '/AdminUserManagement')
api.add_resource(AdminLoginResource, '/AdminLogin')
api.add_resource(StreamerManagementResource, '/StreamerManagement')

# streamer routes
api.add_resource(StreamingResource, '/Streaming')

# constant routes
api.add_resource(FloatConstantResource, '/FloatConstants')
