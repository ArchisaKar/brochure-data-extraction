from fastapi import FastAPI, File, UploadFile, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import base64
import os
import uvicorn
from typing import Optional
from dotenv import load_dotenv
import google.generativeai as genai
import json

load_dotenv()
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

app = FastAPI()

# Allow your frontend to call this API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # ideally replace * with your frontend origin
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def to_base64(file: UploadFile):
    return base64.b64encode(file.file.read()).decode('utf-8')

def create_file_part(file: UploadFile):
    return {
        "inline_data": {  
            "data": to_base64(file),
            "mime_type": file.content_type
        }
    }

@app.post("/upload")
async def analyze_property(
    brochure: UploadFile = File(...),
    floor_plan: Optional[UploadFile] = File(None)
):
    try:
        model = genai.GenerativeModel("gemini-2.0-flash")

        prompt = """
From these pdfs can you extract the following fields: and give it to me in a JSON format
Fields:
property_name: name of the building/property
property_type: the type of the property/bulding (e.g. villa, townhouse, apartment) 
developer: the name of the developer behind the building/property (e.g. Emaar) 
country: country where the building/property is located, if not mentioned find the country where the city is located in
city: city where the building/property is located
location: location in the city where the building/property is located 
price: price of the property 
description: summarized description of the property
bedrooms: the number of bedrooms in the property
bathroom: the number of bathrooms in the property
area: the area of the building/property in sqft or whatever unit is there in the files (e.g. 1,000 - 3,200)
payment_plan: when the customer needs to pay and how much %
handover: the date when the property will be handed over to the user (e.g. Q1 2026) 
down_payment: the down payment of the property in percentage (e.g. 20%) 
average_price_per_sqft: can be calculated from price and sqft 
(from here on these are property amenities, please give the answer as yes or no. If data is not mentioned just say no)
has_maid_room: check if they have a maid room 
has_air_conditioning: check the availability of ACs/chillers
has_balcony_terrace: check if there's a balcony or terrace available in the floor plans
has_bult_in_wadrobes: are wardrobes already built in in the floor plan
has_walk_in_closet: check if there is a walk-in closet in the floor plan
has_health_care_center: check if there are any medical centers/ hospitals in the vicinity of the property
has_kids_play_area: check if there are any parks/ kids play area in the vicinity of the property
has_laundry: check if there is a laundry area in the floor plan
has_sauna: check if there are any saunas in the vicinity of the property
has_spa: check if there are any spas in the vicinity of the property
has_indoor_pool: check if there are any indoor pools in the vicinity of the property
has_lobby_reception: check if there is a reception lobby in the vicinity of the property
has_concierge: check if there is concierge service available 
has_prayer_room: check if there are any prayer rooms in the vicinity of the property
has_parking: check if there is parking availability in the vicinity of the property
has_garden: check if there are any gardens in the vicinity of the property
has_shared_pool: check if there is a pool available, and if it is is it shared, in the vicinity of the property
has_landmark_views: check if there are any landmark views from the property 
has_tennis_court: check if there are any tennis courts in the vicinity of the property
has_running_track: check if there are any running tracks in the vicinity of the property
has_outdoor_dining: check if there is outdoor dining available in the property
has_outdoor_gymnasium: check if there are any outdoor gyms/ gymnasiums in the vicinity of the property
has_bbq_area: check if there are any barbeque areas in the vicinity of the property
is_pet_friendly: check if the property is pet friendly

Respond ONLY with a valid JSON object. No extra explanations, no headings, no code blocks.
        """

        file_parts = [create_file_part(brochure)]
        if floor_plan:
            file_parts.append(create_file_part(floor_plan))

        result = model.generate_content([prompt] + file_parts)
        response = result.text

        # ✅ NEW PART: Parse the JSON
        parsed_response = json.loads(response)

        return JSONResponse(content=parsed_response, status_code=200)

    except Exception as e:
        return JSONResponse(content={"error": str(e)}, status_code=500)

# Optional if running directly
if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
