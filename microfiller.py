from urllib import request, parse
import random
import sys
import time


def node_name():
    adjs = (
        'autumn', 'hidden', 'bitter', 'misty', 'silent', 'empty', 'dry', 'dark',
        'summer', 'icy', 'delicate', 'quiet', 'white', 'cool', 'spring', 'winter',
        'patient', 'twilight', 'dawn', 'crimson', 'wispy', 'weathered', 'blue',
        'billowing', 'broken', 'cold', 'damp', 'falling', 'frosty', 'green',
        'long', 'late', 'lingering', 'bold', 'little', 'morning', 'muddy', 'old',
        'red', 'rough', 'still', 'small', 'sparkling', 'throbbing', 'shy',
        'wandering', 'withered', 'wild', 'black', 'young', 'holy', 'solitary',
        'fragrant', 'aged', 'snowy', 'proud', 'floral', 'restless', 'divine',
        'polished', 'ancient', 'purple', 'lively', 'nameless'
    )

    nouns = (
        'waterfall', 'river', 'breeze', 'moon', 'rain', 'wind', 'sea', 'morning',
        'snow', 'lake', 'sunset', 'pine', 'shadow', 'leaf', 'dawn', 'glitter',
        'forest', 'hill', 'cloud', 'meadow', 'sun', 'glade', 'bird', 'brook',
        'butterfly', 'bush', 'dew', 'dust', 'field', 'fire', 'flower', 'firefly',
        'feather', 'grass', 'haze', 'mountain', 'night', 'pond', 'darkness',
        'snowflake', 'silence', 'sound', 'sky', 'shape', 'surf', 'thunder',
        'violet', 'water', 'wildflower', 'wave', 'water', 'resonance', 'sun',
        'wood', 'dream', 'cherry', 'tree', 'fog', 'frost', 'voice', 'paper',
        'frog', 'smoke', 'star'
    )
    return '{0}-{1}-{2}'.format(random.choice(adjs),
                                random.choice(nouns),
                                random.randint(1000, 9999))


def random_endpoint():
    begin = ('/foo', '/bar', '/foobar', '/hue')
    end = ('name/', 'edit/', 'save/', 'list/')

    if random.randint(0, 100) > 80:
        return '{0}/{1}/{2}'.format(random.choice(begin),
                                    random.randint(1, 100),
                                    random.choice(end))
    else:
        return '{0}/{1}'.format(random.choice(begin),
                                random.choice(end))


class MicrondotFiller(object):
    def __init__(self):
        self.nodes = []
        self.methods = ['GET', 'POST']

    def create_nodes(self):
        for k in range(20):
            self.nodes.append(node_name())

    def requests_a_lot(self):
        for node in self.nodes[:1]:
            time.sleep(1)
            for i in range(5):
                self.request(self.random_node(node), node, random_endpoint())

    def requests_normal(self):
        for node in self.nodes[5:15]:
            time.sleep(0.5)
            self.request(node, self.random_node(node), random_endpoint())

    def request(self, origin, target, endpoint):
        data = {
            'origin': origin,
            'target': target,
            'method': random.choice(self.methods),
            'endpoint': endpoint
        }
        data_encoded = parse.urlencode(data).encode('utf-8')
        if len(sys.argv) > 1:
            url = sys.argv[1]
        else:
            url = 'http://localhost:8001/microdot/'
        request.urlopen(url, data=data_encoded)

    def random_node(self, node):
        new_node = random.choice(self.nodes)
        if new_node == node:
            return self.random_node(node)
        return new_node

    def work(self):
        self.create_nodes()
        self.requests_normal()
        self.requests_a_lot()

if __name__ == '__main__':
    filler = MicrondotFiller()
    filler.work()
