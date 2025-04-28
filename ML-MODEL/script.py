import pandas as pd
import random
from datetime import datetime, timedelta
import faker

# Initialize a Faker instance for generating random descriptions
fake = faker.Faker()

# Sample categories and sources for expenses/incomes, including fictional business names and industries
categories = {
    "Groceries": ["Walmart", "Target", "Whole Foods", "Kroger", "Fresh Mart", "EcoShop", "Green Basket", "GroceryPal"],
    "Utilities": ["Electricity Bill", "Gas Bill", "Water Bill", "Internet Bill", "Cable TV Bill", "Trash Collection"],
    "Rent": ["Monthly Rent", "Property Lease", "Real Estate Payment"],
    "Entertainment": ["Netflix", "Spotify", "Movie Ticket", "Concert", "Online Gaming", "Music Festival"],
    "Transport": ["Gas", "Uber", "Bus Ticket", "Train Ticket", "Car Lease", "Parking Fee", "Bike Rental"],
    "Healthcare": ["Pharmacy", "Doctor Visit", "Hospital Bill", "Dental Care", "Optical Services", "Therapy Session"],
    "Education": ["Tuition Fee", "Online Course", "Books", "School Supplies", "Learning Platform Subscription"],
    "Dining": ["Restaurant", "Cafe", "Fast Food", "Bar", "Takeout", "Food Delivery"],
    "Shopping": ["Clothes", "Electronics", "Amazon Purchase", "Boutique", "Online Shopping", "Gift Shop"],
    "Travel": ["Flight", "Hotel", "Car Rental", "Travel Insurance", "Tourist Attraction", "Cruise", "Flight Upgrade"],
    "Salary": ["Company A", "Company B", "Freelance Project", "Part-time Job", "Consulting", "Gig Economy"],
    "Investment": ["Stock Dividends", "Crypto Profit", "Mutual Funds", "Real Estate Investment", "P2P Lending"],
    "Gift": ["Birthday Gift", "Wedding Gift", "Cash Gift", "Holiday Present", "Gift Card"],
    "Pet Care": ["Pet Food", "Vet Visit", "Pet Insurance", "Pet Grooming", "Pet Toys", "Pet Supplies"],
    "Subscription Fees": ["Netflix Subscription", "Spotify Subscription", "Gym Membership", "Magazine Subscription"]
}

# Additional descriptive data
payment_methods = ["Credit Card", "PayPal", "Cash", "Debit Card", "Bank Transfer", "Cryptocurrency"]
locations = ["New York", "Los Angeles", "San Francisco", "Chicago", "London", "Paris", "Tokyo", "Berlin", "Sydney"]

# Define a function to create synthetic labeled data
def generate_expense_data(num_rows=50000, start_year=2000, end_year=2025):
    data = []
    start_date = datetime(start_year, 1, 1)
    end_date = datetime(end_year, 12, 31)
    date_range = (end_date - start_date).days

    for _ in range(num_rows):
        is_income = random.choice([True, False, False])  # 1/3rd income, 2/3rd expense
        trans_date = start_date + timedelta(days=random.randint(0, date_range))
        
        if is_income:
            category = random.choice(["Salary", "Investment", "Gift"])
            description = random.choice(categories[category]) + " - " + fake.bs()  # Adding a random phrase to make it unique
            amount = round(random.uniform(1000, 10000), 2)  # Randomize income amount
            trans_type = "credit"
        else:
            category = random.choice([cat for cat in categories if cat not in ["Salary", "Investment", "Gift"]])
            description = random.choice(categories[category]) + " - " + fake.bs()  # Adding random unique description
            if category == "Groceries":
                amount = round(random.uniform(10, 300), 2)
            elif category == "Transport":
                amount = round(random.uniform(5, 150), 2)
            elif category == "Dining":
                amount = round(random.uniform(5, 100), 2)
            elif category == "Healthcare":
                amount = round(random.uniform(20, 500), 2)
            elif category == "Rent":
                amount = round(random.uniform(500, 3000), 2)
            else:
                amount = round(random.uniform(5, 500), 2)  # Default range for most categories
            trans_type = "debit"
        
        # Random payment method and vendor location
        payment_method = random.choice(payment_methods)
        location = random.choice(locations)

        data.append({
            "date": trans_date.strftime("%Y-%m-%d"),
            "description": description,
            "category": category,
            "amount": amount,
            "type": trans_type,
            "payment_method": payment_method,
            "location": location
        })

    return pd.DataFrame(data)

# Generate 50,000 rows of data from 2000 to 2025
df_25000 = generate_expense_data(num_rows=50000, start_year=2000, end_year=2025)

# Save to CSV (add a timestamp to the file name to avoid overwriting previous files)
csv_path = f"E:/AI-Finance-Tracker/ML-MODEL/Personal_Finance_Dataset_{datetime.now().strftime('%Y%m%d_%H%M%S')}.csv"
df_25000.to_csv(csv_path, index=False)

print(f"Dataset saved to {csv_path}")
