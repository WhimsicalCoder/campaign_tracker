from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///campaigns.db'
db = SQLAlchemy(app)

class Campaign(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    campaign_name = db.Column(db.String(100), nullable=False)
    platform_name = db.Column(db.String(100), nullable=False)
    start_date = db.Column(db.Date, nullable=False)
    end_date = db.Column(db.Date, nullable=False)
    flags = db.Column(db.String(100), nullable=True)
    notes = db.Column(db.String(255), nullable=True)
    status = db.Column(db.String(10), nullable=False, default='active')

@app.route('/campaigns', methods=['GET', 'POST'])
def manage_campaigns():
    if request.method == 'POST':
        data = request.get_json()
        new_campaign = Campaign(
            campaign_name=data['campaign_name'],
            platform_name=data['platform_name'],
            start_date=datetime.strptime(data['start_date'], '%Y-%m-%d'),
            end_date=datetime.strptime(data['end_date'], '%Y-%m-%d'),
            flags=data.get('flags'),
            notes=data.get('notes'),
            status='active'
        )
        db.session.add(new_campaign)
        db.session.commit()
        return jsonify({"message": "Campaign added"}), 201
    else:
        campaigns = Campaign.query.filter_by(status='active').all()
        return jsonify([{
            "id": c.id,
            "campaign_name": c.campaign_name,
            "platform_name": c.platform_name,
            "start_date": c.start_date.strftime('%Y-%m-%d'),
            "end_date": c.end_date.strftime('%Y-%m-%d'),
            "flags": c.flags,
            "notes": c.notes,
            "status": c.status
        } for c in campaigns])

@app.route('/campaigns/<int:id>/complete', methods=['POST'])
def complete_campaign(id):
    campaign = Campaign.query.get(id)
    if campaign:
        campaign.status = 'completed'
        db.session.commit()
        return jsonify({"message": "Campaign marked as completed"})
    else:
        return jsonify({"message": "Campaign not found"}), 404

if __name__ == '__main__':
    app.run(debug=True)
