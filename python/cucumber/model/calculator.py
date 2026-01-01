class Calculator(object):

    def __init__(self, value=0):
        self.result = value

    def reset(self):
        self.result = 0

    def add(self, x, y):
        assert isinstance(x, int) and isinstance(y, int)
        self.result += (x + y)
        return self.result
