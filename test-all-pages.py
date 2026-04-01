import requests
import time

BASE_URL = "http://localhost:3000"
AI_BACKEND_URL = "http://localhost:8000"

# Test pages
pages_to_test = [
    "/",
    "/about",
    "/courses",
    "/library",
    "/pharmacology",
    "/auth",
    "/login",
    "/dashboard",
    "/admin",
    "/student/dashboard",
    "/settings",
    "/profile"
]

# Test API endpoints
api_endpoints = [
    "/api/health/check",
    "/api/admin/word-of-the-day",
    "/api/admin/partners",
    "/api/flashcards",
    "/api/auth/session"
]

def test_pages():
    print("\n=== Testing Pages ===")
    for page in pages_to_test:
        try:
            response = requests.get(f"{BASE_URL}{page}", timeout=10)
            status = "✓" if response.status_code == 200 else "✗"
            print(f"{status} {page} - {response.status_code}")
        except Exception as e:
            print(f"✗ {page} - Error: {str(e)}")

def test_api_endpoints():
    print("\n=== Testing API Endpoints ===")
    for endpoint in api_endpoints:
        try:
            response = requests.get(f"{BASE_URL}{endpoint}", timeout=10)
            status = "✓" if response.status_code in [200, 401] else "✗"
            print(f"{status} {endpoint} - {response.status_code}")
        except Exception as e:
            print(f"✗ {endpoint} - Error: {str(e)}")

def test_ai_backend():
    print("\n=== Testing AI Backend ===")
    try:
        response = requests.get(f"{AI_BACKEND_URL}/health", timeout=5)
        print(f"{'✓' if response.status_code == 200 else '✗'} AI Backend Health - {response.status_code}")
    except Exception as e:
        print(f"✗ AI Backend Health - Error: {str(e)}")
    
    # Test AI services
    ai_services = [
        "/api/services",
        "/api/chat",
        "/api/study-planner"
    ]
    
    for service in ai_services:
        try:
            response = requests.get(f"{AI_BACKEND_URL}{service}", timeout=5)
            status = "✓" if response.status_code in [200, 404] else "✗"
            print(f"{status} AI Service {service} - {response.status_code}")
        except Exception as e:
            print(f"✗ AI Service {service} - Error: {str(e)}")

if __name__ == "__main__":
    print("Starting Comprehensive Website Check...")
    print("=" * 50)
    
    # Wait for servers to be ready
    print("\nWaiting for servers to initialize...")
    time.sleep(5)
    
    test_pages()
    test_api_endpoints()
    test_ai_backend()
    
    print("\n" + "=" * 50)
    print("Testing Complete!")
