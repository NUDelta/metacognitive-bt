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
    return sum([a*b for a,b in zip(ftr, map(int,time_string.split(':')))])

def hrToSec(time_string):
    ftr = [3600,60,1]
    return sum([a*b for a,b in zip(ftr, map(int,time_string.split(':')))])

datalist = []
webpageList = []

socialMediaSites = []
onlineShoppingSites = []

total_online_time = 0
total_SM_time = 0

with open('/Users/Allison/Desktop/metacognitive-bt/pythonfiles/data.csv', 'rb') as csvfile:
    filereader = csv.reader(csvfile, delimiter=',')
    for row in filereader:
        datalist.append(row[1]);

for i in xrange(0, len(datalist), 5):
    date = datalist[i]
    time = datalist[i+1]
    time_spent = datalist[i+2]
    tab = datalist[i+3]
    url = datalist[i+4]

    total_online_time = total_online_time + float(datalist[i+2])
    webpageList.append(make_webpage(date, time, time_spent, tab, url))

print webpageList[0].time_spent
print webpageList[1].time_spent
print webpageList[2].time_spent
print webpageList[3].time_spent

#Returns the Webpage list, sorted in order of time.
# TimeOrderWPlist = sorted(webpageList, key=lambda x: x.time, reverse=False)
#
# for j in range(0, len(TimeOrderWPlist)-1):
#     TimeOrderWPlist[j].time_spent = hrToSec(TimeOrderWPlist[j+1].time)-hrToSec(TimeOrderWPlist[j].time)
#
# TimeOrderWPlist[len(TimeOrderWPlist)-1].time_spent = hrToSec(TimeOrderWPlist[len(TimeOrderWPlist)-1].time)-hrToSec(TimeOrderWPlist[j].time)
#
# print TimeOrderWPlist[0].time_spent, TimeOrderWPlist[0].time
# print TimeOrderWPlist[1].time_spent, TimeOrderWPlist[1].time
# print TimeOrderWPlist[2].time_spent, TimeOrderWPlist[2].time
# print TimeOrderWPlist[3].time_spent, TimeOrderWPlist[3].time
# print TimeOrderWPlist[4].time_spent, TimeOrderWPlist[4].time
#
# print TimeOrderWPlist[len(TimeOrderWPlist)-3].time_spent, TimeOrderWPlist[len(TimeOrderWPlist)-3].time
# print TimeOrderWPlist[len(TimeOrderWPlist)-2].time_spent, TimeOrderWPlist[len(TimeOrderWPlist)-2].time
# print TimeOrderWPlist[len(TimeOrderWPlist)-1].time_spent, TimeOrderWPlist[len(TimeOrderWPlist)-1].time
#
# start = hrToSec(TimeOrderWPlist[0].time)
# end = hrToSec(TimeOrderWPlist[len(TimeOrderWPlist)-1].time)
# total_online_time = end - start
#print total_online_time




for webpage in webpageList:
    # if len(webpage.time_spent) == 4:
    #     total_online_time = total_online_time + minToSec(site.time_spent)
    # elif len(webpage.time_spent) == 6:
    #     total_online_time = total_online_time + hrToSec(site.time_spent)
    if ("facebook.com" or "instagram.com" or "reddit.com" or "imgur.com"
        or "tumblr.com" or "pinterest.com" or "linkedin.com" or "netflix.com"
        or "twitter.com" or "messenger.com" or "youtube.com" or "buzzfeed.com") in webpage.url:
        socialMediaSites.append(webpage)
    else:
        continue

for site in socialMediaSites:
    total_SM_time = total_SM_time + site.time_spent
#
print "Total time online for this browsing session: " + str(total_online_time) + " seconds."
if total_SM_time == 0:
    print "good job you didn't spend any time on social media"
else:
    print "Total time on social media for this browsing session: " + str(total_SM_time) + " seconds, which is " + str(total_online_time/total_SM_time) + " %."
#
#
# #find out how much time you spend on social media
