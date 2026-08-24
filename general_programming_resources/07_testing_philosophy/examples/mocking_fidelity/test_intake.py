from intake import should_retract_intake
from sensors import FaithfulSensor, UnfaithfulSensor


def test_with_faithful_mock():
    assert should_retract_intake(FaithfulSensor()) == True


def test_with_unfaithful_mock():
    assert should_retract_intake(UnfaithfulSensor()) == True


if __name__ == "__main__":
    for name, test in [
        ("test_with_faithful_mock", test_with_faithful_mock),
        ("test_with_unfaithful_mock", test_with_unfaithful_mock),
    ]:
        try:
            test()
            print(f"{name}: PASS")
        except AssertionError:
            print(f"{name}: FAIL")
