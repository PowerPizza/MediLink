import supabase
from config import getSettings

settings = getSettings()

class CloudStorage:
    storage = None
    connection = None
    initial_buckets: dict = None
    def __init__(self):
        self.connection = supabase.create_client(supabase_url=settings.supabase_url, supabase_key=settings.supabase_secret_key)
        self.storage = self.connection.storage
        print("Supabase has been initialized.")

    def createInitialFolderIfNotExists(self):
        existing_buckets = list(map(lambda bucket: bucket.id, self.storage.list_buckets()))
        for (bucket_id, bucket_name) in self.initial_buckets.items():
            if bucket_id not in existing_buckets:
                self.storage.create_bucket(bucket_id, bucket_name)

        print("Initial folder structure has been created.")

    def createFile(self, bucket_id, file_name, file_data, mimetype="text/html"):
        response = self.storage.from_(bucket_id).upload(
            file=file_data,
            path=f"/{file_name}",
            file_options={"cache-control": "3600", "upsert": "true"}
        )
        return response.fullPath

cloud_storage = CloudStorage()

# Map bucket ids and bucket name for auto-creation
cloud_storage.initial_buckets = {
    "report-bucket": "Reports",
    "pfp-bucket": "PFPs",
    "pfp-doctor-bucket": "Doctors-PFPs",
    "pfp-patient-bucket": "Patient-PFPs"
}

cloud_storage.createInitialFolderIfNotExists()

if __name__ == '__main__':
    cv = cloud_storage.createFile("report-bucket", "Jakc.txt", b"Helo")
    print(cv)