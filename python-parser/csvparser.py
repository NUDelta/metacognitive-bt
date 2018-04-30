import csv

class Webpage(object):
    def __init__(self, date, time, time_spent, tab, url):
        self.date = date
        self.time = time
        self.time_spent = time_spent
        self.tab = tab
        self.url = url

def make_webpage(date, time, time_spent, tab, url):
    webpage = Webpage(date, time, time_spent, tab, url)
    return webpage

def minToSec(time_string):
    ftr = [60,1]
    if "." in time_string:
        return sum([a*b for a,b in zip(ftr, map(int,time_string.split('.')))])
        # return (float(time_string) * 1000)
    else:
        return sum([a*b for a,b in zip(ftr, map(int,time_string.split(':')))])


def hrToSec(time_string):
    ftr = [3600,60,1]
    if "." in time_string:
        return sum([a*b for a,b in zip(ftr, map(int,time_string.split('.')))])
    else:
        return sum([a*b for a,b in zip(ftr, map(int,time_string.split(':')))])

datalist = []
webpageList = []

socialMediaSites = []
onlineShoppingSites = []

total_online_time = 0
total_SM_time = 0

with open('data.csv', 'rb') as csvfile:
    filereader = csv.reader(csvfile, delimiter=',')
    for row in filereader:
        datalist.append(row[1]);

for i in xrange(0, len(datalist), 5):
    date = datalist[i]
    time = datalist[i+1]
    time_spent = datalist[i+2]
    tab = datalist[i+3]
    url = datalist[i+4]
    print(date,time,time_spent, tab, url)

    total_online_time = total_online_time + (minToSec(datalist[i+2]))
    print("time_spent", datalist[i+2])
    print("minToSec", total_online_time)
    webpageList.append(make_webpage(date, time, time_spent, tab, url))


for webpage in webpageList:
    #print webpage.url
    if ("facebook.com" or "instagram.com" or "reddit.com" or "imgur.com"
        or "tumblr.com" or "pinterest.com" or "linkedin.com" or "netflix.com"
        or "twitter.com" or "messenger.com" or "youtube.com" or "buzzfeed.com") in webpage.url:
        socialMediaSites.append(webpage)
    else:
        continue

for site in socialMediaSites:
    total_SM_time = total_SM_time + minToSec(site.time_spent)
#
print "Total time online for this browsing session: " + str(total_online_time) + " seconds."
if total_SM_time == 0:
    print "good job you didn't spend any time on social media"
else:
    print "Total time on social media for this browsing session: " + str(total_SM_time) + " seconds, which is " + str(total_online_time/total_SM_time) + " %."
