#!/usr/bin/env python

###############################################################################
# We create a processor class that will be used to process the data.
# The processor class will send the data to the API as necessary, and will
# also continuously check for new data.
###############################################################################

import os
import time
from typing import Dict
from dotenv import load_dotenv
from dotenv import dotenv_values
import boto3
import requests

load_dotenv()

class Processor:
    env = {}

    def __init__(self):
        self.env = dotenv_values(".env")

    # Print with a timestamp
    def print_with_timestamp(self, message):
        print(time.strftime("%H:%M:%S") + ": " + str(message))

    # Send a request to the API
    # url: The URL to send the request to
    # data: The data to send
    # return: Whether or not the request was successful
    def send_request(self, url: str, data: Dict) -> bool:
        # Send a request to the API
        resp = requests.post(
            url,
            json=data,
            headers={
                "Authorization": "Bearer " + self.env.get("ADMIN_TOKEN")
            }
        )
        if resp.status_code == 200:
            data = resp.json()
            if not data['success']:
                self.print_with_timestamp(data['message'])
                self.print_with_timestamp("Error sending data.")
                return False
            else:
                self.print_with_timestamp(data)
                self.print_with_timestamp("Data sent successfully.")
                return True
        else:
            self.print_with_timestamp(resp)
            self.print_with_timestamp("Error sending data.")
            return False

    def process(self, data):
        # Process the data
        # Get transcription from AWS Boto 3
        #transcribe = boto3.client('transcribe', aws_access_key_id=self.env.get("AWS_ACCESS_KEY_ID"), aws_secret_access_key=self.env.get("AWS_SECRET_ACCESS_KEY"))
        job_name = data['_id'] + "_" + str(time.time())
        transcribe = boto3.client('transcribe', aws_access_key_id="AKIAX6JJJCRSDW6IQXZV", aws_secret_access_key="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", region_name='us-west-2')
        job_uri = "s3://test-4912/" + data['videoName']
        transcribe.start_transcription_job(
            TranscriptionJobName=job_name,
            Media={'MediaFileUri': job_uri},
            MediaFormat='mp4',
            LanguageCode='en-US',
            OutputBucketName='test-4912'
        )
        self.print_with_timestamp("Transcription job started.")
        status = ""
        transcription = ""
        while True:
            status = transcribe.get_transcription_job(TranscriptionJobName=job_name)
            if status['TranscriptionJob']['TranscriptionJobStatus'] in ['COMPLETED', 'FAILED']:
                break
            time.sleep(1)
        if status['TranscriptionJob']['TranscriptionJobStatus'] == 'FAILED':
            self.print_with_timestamp("Transcription job failed.")
            return False
        else:
            self.print_with_timestamp("Transcription job completed.")
            # Get the transcript from AWS Boto 3
            transcript_url = status['TranscriptionJob']['Transcript']['TranscriptFileUri']
            transcript = transcript_url.split("/")[-1]
            client = boto3.client('s3', aws_access_key_id="AKIAX6JJJCRSDW6IQXZV", aws_secret_access_key="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", region_name='us-west-2')
            transcription = client.get_object(Bucket='test-4912', Key=transcript).get('Body').read().decode('utf-8')
            self.print_with_timestamp("Transcript downloaded.")

        # Send the data to the API
        url = self.env.get("REACT_APP_API_URL")
        body = {
            "pitchId": data["_id"],
            "processed": 2,
            "transcription": transcription
        }
        self.send_request(url + "/api/pitch/process", body)

    def check_for_new_data(self):
        # Check for new data
        # If new data is found, process it        
        url = self.env.get("REACT_APP_API_URL")
        url += "/api/pitch/getUnprocessed"
        
        resp = requests.get(
            url,
            headers={
                "Authorization": "Bearer " + self.env.get("ADMIN_TOKEN")
            }
        )
        if resp.status_code == 200:
            data = resp.json()
            if not data['success']:
                self.print_with_timestamp(data['message'])
                self.print_with_timestamp("Error checking for new data.")
            else:
                if len(data["pitches"]) == 0:
                    self.print_with_timestamp("No new data found.")
                for d in data["pitches"]:
                    self.process(d)
                    # Mark the data as processed
        else:
            self.print_with_timestamp(resp)
            self.print_with_timestamp("Error checking for new data.")

def main():
    # Create a processor
    processor = Processor()
    # Continuously check for new data
    while True:
        processor.check_for_new_data()
        # Sleep for a few seconds
        time.sleep(3)

if __name__ == "__main__":
    main()

