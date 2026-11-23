
print("STEP 1: Test file started")

from backend.assistant import get_waste_guidance

print("STEP 2: Assistant imported successfully")

result = get_waste_guidance("plastic")

print("STEP 3: Assistant function executed")

print("\nResult:")
print(result)
