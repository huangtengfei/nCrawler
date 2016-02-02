## a nodejs crawler

tips:

1. 每次抓取url的时延要大一点，不然会导致 request too many

2. async.mapLimit 的线程数限制要小一点，线程一多又会导致 request too many 