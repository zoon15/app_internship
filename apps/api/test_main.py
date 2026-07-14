from fastapi.testclient import TestClient

from main import app

client = TestClient(app)


def test_health_endpoint():
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json()["status"] == "ok"


def test_list_internships_endpoint():
    response = client.get("/internships")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert len(data) >= 1


def test_submit_application_endpoint():
    response = client.post(
        "/applications",
        json={
            "internship_id": "demo-internship",
            "student_name": "Ada",
            "cover_letter": "Interested in product design.",
        },
    )
    assert response.status_code == 200
    body = response.json()
    assert body["status"] == "submitted"
    assert body["student_name"] == "Ada"
