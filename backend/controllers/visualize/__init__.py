from flask import Blueprint,request,jsonify
from utils.ApiError import ApiError
from config import db,jwt
from sqlalchemy import func,cast,Integer
from textblob import TextBlob
from flask_jwt_extended import jwt_required
from constants.https_status_codes import *
from utils.ApiResponse import ApiResponse
from models import CompData
visualize=Blueprint("visualize",__name__,url_prefix="/api/v1/visualize")


@visualize.route("/",methods=['GET'])
@jwt_required()
def get_all():
    all_data=CompData.query.all()
    json_data=list(map(lambda x:x.to_json(),all_data))
    if (not all_data):
        return ApiError("No Data Found",HTTP_400_BAD_REQUEST)
    return ApiResponse("All Data Fetched",HTTP_200_OK,{"json_Data":json_data,"length":len(json_data)})

@visualize.route("/post-data",methods=['POST'])
@jwt_required()
def post_data():

    data=request.get_json()
    new_data = CompData(
            end_year=data.get('end_year', ""),
            intensity=data.get('intensity', ""),
            sector=data.get('sector', ""),
            insight=data.get('insight', ""),
            topic=data.get('topic', ""),
            url=data.get('url', ""),
            region=data.get('region', ""),
            start_year=data.get('start_year', ""),
            impact=data.get('impact', ""),
            added=data.get('added', ""),
            published=data.get('published', ""),
            country=data.get('country', ""),
            relevance=data.get('relevance', ""),
            pestle=data.get('pestle', ""),
            source=data.get('source', ""),
            title=data.get('title', ""),
            likelihood=data.get('likelihood', "")
        )
    try:
        db.session.add(new_data)
        db.session.commit()
        print("Data Added")
        return ApiResponse("Data Added!",HTTP_200_OK,new_data.to_json()) 
    except Exception as e:
        print("error")
        db.session.rollback()
        return ApiError("DATA not added",HTTP_400_BAD_REQUEST)
    
@visualize.route("/post-data-bulk",methods=['POST'])
@jwt_required()
def post_data_bulk():
    bulk_data = request.get_json()['data']
    new_entries = []
    json_entry=[]
    
    for data in bulk_data:
        new_data = CompData(
            end_year=data.get('end_year', ""),
            intensity=data.get('intensity', ""),
            sector=data.get('sector', ""),
            insight=data.get('insight', ""),
            topic=data.get('topic', ""),
            url=data.get('url', ""),
            region=data.get('region', ""),
            start_year=data.get('start_year', ""),
            impact=data.get('impact', ""),
            added=data.get('added', ""),
            published=data.get('published', ""),
            country=data.get('country', ""),
            relevance=data.get('relevance', ""),
            pestle=data.get('pestle', ""),
            source=data.get('source', ""),
            title=data.get('title', ""),
            likelihood=data.get('likelihood', "")
        )
        new_entries.append(new_data)
        json_entry.append(new_data.to_json())

    try:
        db.session.bulk_save_objects(new_entries)
        db.session.commit()
        return ApiResponse("Data Added!", HTTP_200_OK,json_entry)
    except Exception as e:
        db.session.rollback()
        print(f"Error occurred: {e}")
        return ApiError("Data not added", HTTP_400_BAD_REQUEST)

@visualize.route("/countries_by_likelihood",methods=['GET'])
@jwt_required()
def countriesByLikelyhood():
    highest_likelihood = db.session.query(func.max(cast(CompData.likelihood, Integer))).scalar()
    topCountries=db.session.query(CompData).filter(cast(CompData.likelihood,Integer)==highest_likelihood).all()
    added_countries_impact=set()

    topCountries_serialized = []
    for miohl in topCountries:
        if (miohl.country not in added_countries_impact):

            topCountries_serialized.append(miohl.country,)

            added_countries_impact.add(miohl.country)

    data={
        "highest_likelihood":highest_likelihood,
        "topCountries_serialized":topCountries_serialized
    }
    
    return  ApiResponse("Data for Intensity by Year Fetched!", HTTP_200_OK,data)


@visualize.route("/sectors_by_regions",methods=['GET'])
@jwt_required()
def sectorByRegion():
    topicList=db.session.query(CompData).order_by(CompData.topic).all()
    topics=set()

    topicsByRegion_serialized = []
    for miohl in topicList:
        if (miohl.topic not in topics):

            topicsByRegion_serialized.append({
                "region":miohl.region,
                "topics":miohl.topic
            })

            topics.add(miohl.topic)

    data={
        "topicsByRegion_serialized":topicsByRegion_serialized
    }
    
    return  ApiResponse("Data for Intensity by Year Fetched!", HTTP_200_OK,data)

@visualize.route("/trends_of_relevance",methods=['GET'])
@jwt_required()
def trendsOfRelevance():
    relevance_yearly_trends=db.session.query(
        cast(CompData.start_year, Integer).label('year'),
        func.avg(cast(CompData.relevance, Integer)).label('avg_relevance'),
    ).filter(CompData.start_year.isnot(None)).group_by(CompData.start_year).all()

    yearly_relevance_serialized=[
        {
            "avg_relevance":data.avg_relevance,
            "year":data.year
        }for data in relevance_yearly_trends
    ]
    return  ApiResponse("Data for Relevance by Year Fetched!", HTTP_200_OK,yearly_relevance_serialized)

@visualize.route("filter_by_region",methods=['GET'])
@jwt_required()
def filterByRegion():
    filterByRegion=CompData.query.order_by(CompData.region).all()
    filterByRegion_serialized=[
        {
            "region": filter.region,
            "end_year": filter.end_year,
            "intensity": filter.intensity,
            "sector": filter.sector,
            "insight": filter.insight,
            "topic": filter.topic,
            "insight": filter.title, 
            "url": filter.url,
            "start_year": filter.start_year,
            "impact": filter.impact,
            "added": filter.added,
            "published": filter.published,
            "country": filter.country,
            "relevance": filter.relevance,
            "pestle": filter.pestle,
            "source": filter.source,
            "title": filter.title,
            "likelihood": filter.likelihood
        }for filter in filterByRegion
    ]
    return ApiResponse("Data for Relevance by Year Fetched!", HTTP_200_OK,filterByRegion_serialized)

@visualize.route("filter_by_country",methods=['GET'])
@jwt_required()
def filterByCountry():
    filterByCountry=CompData.query.order_by(CompData.country).distinct()
    filterByCountry_serialized=[
        {
            "region": filter.region,
            "end_year": filter.end_year,
            "intensity": filter.intensity,
            "sector": filter.sector,
            "insight": filter.insight,
            "topic": filter.topic,
            "insight": filter.title, 
            "url": filter.url,
            "start_year": filter.start_year,
            "impact": filter.impact,
            "added": filter.added,
            "published": filter.published,
            "country": filter.country,
            "relevance": filter.relevance,
            "pestle": filter.pestle,
            "source": filter.source,
            "title": filter.title,
            "likelihood": filter.likelihood
        }for filter in filterByCountry
    ]
    return ApiResponse("Data for Relevance by Year Fetched!", HTTP_200_OK,filterByCountry_serialized)

@visualize.route("filter_by_topic",methods=['GET'])
@jwt_required()
def filterByTopic():
    filterByTopic=CompData.query.order_by(CompData.topic).distinct()
    filterByTopic_serialized=[
        {
            "region": filter.region,
            "end_year": filter.end_year,
            "intensity": filter.intensity,
            "sector": filter.sector,
            "insight": filter.insight,
            "topic": filter.topic,
            "insight": filter.title, 
            "url": filter.url,
            "start_year": filter.start_year,
            "impact": filter.impact,
            "added": filter.added,
            "published": filter.published,
            "country": filter.country,
            "relevance": filter.relevance,
            "pestle": filter.pestle,
            "source": filter.source,
            "title": filter.title,
            "likelihood": filter.likelihood
        }for filter in  filterByTopic

    ]
    return ApiResponse("Data for Relevance by Year Fetched!", HTTP_200_OK,filterByTopic_serialized)

@visualize.route("filter_by_source",methods=['GET'])
@jwt_required()
def filterBySource():
    filterBySource=CompData.query.order_by(CompData.source).distinct()
    filterBySource_serialized=[
        {
            "region": filter.region,
            "end_year": filter.end_year,
            "intensity": filter.intensity,
            "sector": filter.sector,
            "insight": filter.insight,
            "topic": filter.topic,
            "insight": filter.title, 
            "url": filter.url,
            "start_year": filter.start_year,
            "impact": filter.impact,
            "added": filter.added,
            "published": filter.published,
            "country": filter.country,
            "relevance": filter.relevance,
            "pestle": filter.pestle,
            "source": filter.source,
            "title": filter.title,
            "likelihood": filter.likelihood
        }for filter in  filterBySource

    ]
    return ApiResponse("Data for Relevance by Year Fetched!", HTTP_200_OK,filterBySource_serialized)


@visualize.route('/analysis',methods=['GET'])
@jwt_required()
def analysis():

    data={
        "countriesByLikelihood":countriesByLikelihood(),
        "source_contribution":source_contribution(),
        "pestle_distribution":pestle_distribution(),
        "sentiment_analysis":sentiment_analysis(),
        "impact_relevance_analysis":impact_relevance_analysis(),
        "insights_by_url":insights_by_url(),
        "get_metrics":get_metrics()
    }

    return ApiResponse("Analysis Fetched successfull",HTTP_200_OK,data)




def countriesByLikelihood():
    # Query to get countries and their likelihood, excluding empty country names
    country_likelihoods = db.session.query(
        CompData.country,
        CompData.likelihood
    ).filter(CompData.country != '').all()

    # Dictionary to store the highest likelihood for each country
    country_likelihood_dict = {}

    # Iterate through the results and update the likelihood if it's greater than the existing one
    for country, likelihood in country_likelihoods:
        try:
            # Convert likelihood from string to a float for comparison
            likelihood_value = float(likelihood)
        except ValueError:
            # Skip if likelihood cannot be converted to a float
            continue

        # Check if the country is not already in the dictionary or if the new likelihood is greater
        if country not in country_likelihood_dict or likelihood_value > country_likelihood_dict[country]:
            country_likelihood_dict[country] = likelihood_value

    # Serialize the result into a list of dictionaries
    country_likelihood_serialized = [
        {
            "country": "USA" if country=='United States of America' else country,
            "likelihood": str(likelihood)  # Convert back to string for serialization
        } for country, likelihood in country_likelihood_dict.items()
    ]

    return country_likelihood_serialized

def source_contribution():
    # Query to count occurrences of each source
    source_counts = db.session.query(
        CompData.source,
        func.count(CompData.id).label('count')
    ).filter(
        CompData.source != ''  # Exclude empty source entries
    ).group_by(
        CompData.source
    ).order_by(
        func.count(CompData.id).desc()  # Order by count descending
    ).limit(10).all()  # Limit to top 10 sources

    # Serialize the data for response
    source_contribution_data = [
        {
            "source": source,
            "count": count
        } for source, count in source_counts
    ]
    return source_contribution_data

def pestle_distribution():
    # Query to count occurrences of each pestle category
    pestle_counts = db.session.query(
        CompData.pestle,
        func.count(CompData.id).label('count')
    ).filter(
        CompData.pestle != ''  # Exclude empty pestle entries
    ).group_by(
        CompData.pestle
    ).all()

    # Serialize the data for response
    pestle_distribution_data = [
        {
            "pestle": pestle,
            "count": count
        } for pestle, count in pestle_counts
    ]

    return pestle_distribution_data

def sentiment_analysis():
    # Query all title and insight data
    entries = db.session.query(CompData.title, CompData.insight).all()

    # Initialize sentiment counters
    sentiment_counts = {
        'positive_title': 0,
        'negative_title': 0,
        'neutral_title': 0,
        'positive_insight': 0,
        'negative_insight': 0,
        'neutral_insight': 0
    }

    # Analyze sentiment for each entry
    for title, insight in entries:
        # Analyze title sentiment
        if title:
            title_sentiment = TextBlob(title).sentiment.polarity
            if title_sentiment > 0:
                sentiment_counts['positive_title'] += 1
            elif title_sentiment < 0:
                sentiment_counts['negative_title'] += 1
            else:
                sentiment_counts['neutral_title'] += 1

        # Analyze insight sentiment
        if insight:
            insight_sentiment = TextBlob(insight).sentiment.polarity
            if insight_sentiment > 0:
                sentiment_counts['positive_insight'] += 1
            elif insight_sentiment < 0:
                sentiment_counts['negative_insight'] += 1
            else:
                sentiment_counts['neutral_insight'] += 1

    # Prepare data for the frontend
    sentiment_data = {
        'titles': {
            'positive': sentiment_counts['positive_title'],
            'negative': sentiment_counts['negative_title'],
            'neutral': sentiment_counts['neutral_title']
        },
        'insights': {
            'positive': sentiment_counts['positive_insight'],
            'negative': sentiment_counts['negative_insight'],
            'neutral': sentiment_counts['neutral_insight']
        }
    }

    return sentiment_data

def impact_relevance_analysis():
    results = (
        db.session.query(
            CompData.start_year,
            CompData.end_year,
            func.avg(CompData.impact).label('average_impact'),
            func.avg(CompData.relevance).label('average_relevance')
        )
        .filter(
            CompData.impact != "",
            CompData.relevance != "",
            CompData.start_year != "",
            CompData.end_year != ""
        )
        .group_by(CompData.start_year, CompData.end_year)
        .order_by(CompData.start_year)
        .all()
    )

    data = []
    for start_year, end_year, avg_impact, avg_relevance in results:
        data.append({
            "start_year": start_year,
            "end_year": end_year,
            "average_impact": avg_impact,
            "average_relevance": avg_relevance
        })

    return data

def insights_by_url():
    results = (
        db.session.query(
            CompData.url,
            func.count(CompData.id).label('insight_count'),
            func.avg(CompData.relevance).label('average_relevance')
        )
        .filter(CompData.url != "")  # Skip entries where URL is empty
        .group_by(CompData.url)
        .order_by(func.count(CompData.id).desc())
        .limit(10)  # Limit to top 10 URLs
        .all()
    )

    data = []
    for url, insight_count, average_relevance in results:
        data.append({
            "url": url,
            "insight_count": insight_count,
            "average_relevance": average_relevance
        })

    return data

def get_metrics():
    # Initialize metrics dictionary
    metrics = {}

    # Query for Highest Intensity
    highest_intensity = db.session.query(func.max(CompData.intensity)).scalar()
    metrics["highestIntensity"] = highest_intensity

    # Query for Lowest Impact
    lowest_impact = db.session.query(func.min(CompData.impact)).scalar()
    metrics["lowestImpact"] = lowest_impact

    # Query for Max Likelihood
    max_likelihood = db.session.query(func.max(CompData.likelihood)).scalar()
    metrics["maxLikelihood"] = max_likelihood

    # Query for Min Relevance
    min_relevance = db.session.query(func.min(CompData.relevance)).scalar()
    metrics["minRelevance"] = min_relevance

    # Query for Top Source
    top_source = db.session.query(CompData.source, func.count(CompData.source)).group_by(CompData.source).order_by(func.count(CompData.source).desc()).first()
    metrics["topSource"] = top_source[0] if top_source else None

    # Query for Recent Insight
    recent_insight = db.session.query(CompData).order_by(CompData.added.desc()).first()
    metrics["recentInsight"] = recent_insight.title if recent_insight else None

    # Query for Oldest Entry
    oldest_entry = db.session.query(CompData).order_by(CompData.added.asc()).first()
    metrics["oldestEntry"] = oldest_entry.title if oldest_entry else None

    # Query for Frequent Topic
    frequent_topic = db.session.query(CompData.topic, func.count(CompData.topic)).group_by(CompData.topic).order_by(func.count(CompData.topic).desc()).first()
    metrics["frequentTopic"] = frequent_topic[0] if frequent_topic else None

    # Query for Dominant PESTLE
    dominant_pestle = db.session.query(CompData.pestle, func.count(CompData.pestle)).group_by(CompData.pestle).order_by(func.count(CompData.pestle).desc()).first()
    metrics["dominantPESTLE"] = dominant_pestle[0] if dominant_pestle else None

    # Query for Average Duration (if start_year and end_year are available)
    avg_duration = (
    db.session.query(
        func.avg(
            func.coalesce(func.cast(CompData.end_year, db.Integer), 0) - 
            func.coalesce(func.cast(CompData.start_year, db.Integer), 0)
        )
    ).scalar()
    )
    metrics["averageDuration"] = avg_duration

    # Query for Peak Year
    peak_year = db.session.query(CompData.start_year, func.count(CompData.start_year)).group_by(CompData.start_year).order_by(func.count(CompData.start_year).desc()).first()
    metrics["peakYear"] = peak_year[0] if peak_year else None

    # Query for Common Region
    common_region = db.session.query(CompData.region, func.count(CompData.region)).group_by(CompData.region).order_by(func.count(CompData.region).desc()).first()
    metrics["commonRegion"] = common_region[0] if common_region else None

    # Query for Popular URL
    popular_url = db.session.query(CompData.url, func.count(CompData.url)).group_by(CompData.url).order_by(func.count(CompData.url).desc()).first()
    metrics["popularURL"] = popular_url[0] if popular_url else None

    # Query for Leading Sector
    leading_sector = db.session.query(CompData.sector, func.count(CompData.sector)).group_by(CompData.sector).order_by(func.count(CompData.sector).desc()).first()
    metrics["leadingSector"] = leading_sector[0] if leading_sector else None

    # Query for Strong Insight (highest impact or relevance)
    strong_insight = (
        db.session.query(CompData)
        .order_by(CompData.impact.desc())
        .first()
    )
    metrics["strongInsight"] = strong_insight.title if strong_insight else None

    return metrics

@visualize.route('/basic-details',methods=['GET'])
@jwt_required()
def basic_details():
    totalRecords=CompData.query.count()
    highest_intensity = db.session.query(func.max(cast(CompData.intensity, Integer))).scalar()
    highest_relevance = db.session.query(func.max(cast(CompData.relevance, Integer))).scalar()
    highest_likelihood = db.session.query(func.max(cast(CompData.likelihood, Integer))).scalar()
    
    data={
        "highest_intensity": highest_intensity,
        "highest_likelihood":highest_likelihood,
        "totalRecords":totalRecords,
        "topSectors":topSectors(highest_intensity),
        "highest_Relevance":highest_relevance,
        "topic_Count":topicByCount(),
        # "mostRelevant":mostRevelant(highest_relevance),
        "mostImpactedOrHighlyLikehood_serialized":mostImpactorHighlyLikelyhood(),
        "yearly_insights":yearly_insights()
    }
    return ApiResponse("Basic Data Fetched",HTTP_200_OK,data)

def yearly_insights():
    yearly_data = db.session.query(
        cast(CompData.start_year, Integer).label('year'),
        func.avg(cast(CompData.intensity, Integer)).label('avg_intensity'),
        func.avg(cast(CompData.likelihood, Integer)).label('avg_likelihood'),
        func.avg(cast(CompData.impact, Integer)).label('avg_impact')
    ).filter(CompData.start_year.isnot(None)).group_by(CompData.start_year).all()

    yearly_trends = [
        {
            "year": data.year,
            "avg_intensity": data.avg_intensity,
            "avg_likelihood": data.avg_likelihood,
            "avg_impact": data.avg_impact
        }
        for data in yearly_data
    ]

    return yearly_trends

def mostImpactorHighlyLikelyhood():
    # Dictionary to store the highest impact for each sector
    added_sectors_impact = {}

    # Query all the necessary data
    mostImpactedOrHighlyLikehood = db.session.query(CompData).all()
    mostImpactedOrHighlyLikely_serialized = []

    for miohl in mostImpactedOrHighlyLikehood:
        # Skip sectors with an empty name or sector length <= 1
        if not miohl.sector.strip() or len(miohl.country) <= 1:
            continue

        current_impact = miohl.impact

        # Check if the sector is not in the dictionary or the current impact is higher
        if miohl.sector not in added_sectors_impact or current_impact > added_sectors_impact[miohl.sector]:
            added_sectors_impact[miohl.sector] = current_impact  # Update the impact for the sector

            # Update the list by removing the old entry if it exists, and adding the new one
            mostImpactedOrHighlyLikely_serialized = [
                item for item in mostImpactedOrHighlyLikely_serialized if item['sector'] != miohl.sector
            ]

            # Add the new sector data
            mostImpactedOrHighlyLikely_serialized.append({
                "country": "USA" if miohl.country == 'United States of America' else miohl.country,
                "region": miohl.region,
                "sector": miohl.sector,
                "impact": miohl.impact,
                "likelihood": miohl.likelihood
            })

    return mostImpactedOrHighlyLikely_serialized


def mostRevelant(highest_relevance):
    mostRelevant=db.session.query(CompData).filter(cast(CompData.relevance,Integer)==highest_relevance or cast(CompData.relevance,Integer)==highest_relevance-1).all()
    mostRelevant_serialized = [
        {
            "intensity": relevant.intensity,
            "title":relevant.title,
            "topic": relevant.topic,
        }
        for relevant in mostRelevant
    ]

    return mostRelevant_serialized

def topSectors(highest_intensity):
    topSectors=db.session.query(CompData).filter(cast(CompData.intensity,Integer)==highest_intensity).all()
    topSectors_serialized = [
        {
            "sector": sector.sector,
            "intensity": sector.intensity,
            "title":sector.title,
            "topic": sector.topic,
            "country": sector.country,
            "relevance": sector.relevance
        }
        for sector in topSectors
    ]
    return topSectors_serialized

def topicByCount():
    topic_counts=db.session.query(
        CompData.topic,
        func.count(CompData.topic)
    ).filter(CompData.topic != '').group_by(CompData.topic).all()

    topic_count_serialized=[
        {
            "topic":topic,
            "count":count
        }for topic,count in topic_counts
    ]

    return topic_count_serialized