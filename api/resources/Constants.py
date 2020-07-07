from flask_restful import Resource
from api.resources import load_json, validate_admin_token, load_header_token
from api.models import db, FloatConstantModel, object_as_dict
from datetime import datetime as dt


# make a class to handle updating and getting the constants
class FloatConstantResource(Resource):
    # get the constants
    def get(self):
        # get the admin_data and authenticate the admin
        token = load_header_token()

        # validate the admin
        message, error_code = validate_admin_token(token)
        if message:
            return message, error_code

        # get all the constants
        constants = [object_as_dict(constant)
                     for constant in FloatConstantModel.query.all()]

        return {'status': 'success', 'constants': constants}, 201

    # change the constants based on name
    def put(self):
        # get the data
        data = load_json()

        try:
            token = data['token']
            constant_name = data['name']
            new_constant_value = data['newConstantValue']
        except KeyError:
            return {'message': 'must include: token, constant_name, new_constant_value'}, 422

        # validate the admin
        privileges, code = validate_admin_token(token)

        # return a code if invalid
        if code >= 400:
            return privileges, code

        # change the constant
        constant = FloatConstantModel.query.filter_by(
            name=constant_name).first()

        if not constant:
            return {'message': f"Did not find any constants associated with {constant_name}"}

        constant.constant = new_constant_value
        db.session.commit()

        return {'status': 'success', 'message': f"Changed {constant.name} to {constant.constant}"}, 201
