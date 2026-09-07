import json,time,urllib.request
from pathlib import Path
base='https://lis.virginia.gov'
headers={'WebAPIKey':'FCE351B6-9BD8-46E0-B18F-5572F4CCA5B9','User-Agent':'SafeLegalAI-Bot/1.0 (+https://safelegalai.com/datasets; hello@safelegalai.com)','content-type':'application/json; charset=utf-8'}
out=Path('work/sources/va')
def req(url, method='GET', payload=None):
    data=None
    if payload is not None:
        data=json.dumps(payload).encode()
    r=urllib.request.Request(url,data=data,headers=headers,method=method)
    with urllib.request.urlopen(r,timeout=60) as resp:
        return resp.status, resp.read().decode('utf-8','ignore')
for bill in ['HB249','HB1642','HB2433','HB2692']:
    q=f'?sessionCode=20251&billNumber={bill}'
    status,text=req(base+'/LegislationVersion/api/GetLegislationVersionbyBillNumberAsync'+q)
    print(bill,status,len(text))
    (out/f'{bill}-versions.json').write_text(text)
    if not text.strip():
        continue
    vers=json.loads(text).get('LegislationsVersion') or []
    if not vers: continue
    legid=vers[0]['LegislationID']
    for endpoint,name,method,payload in [
        (f'/Legislation/api/GetLegislationByIdAsync/{legid}',f'{bill}-bill.json','GET',None),
        (f'/LegislationEvent/api/GetLegislationEventByLegislationIDAsync/{legid}',f'{bill}-events.json','GET',None),
        (f'/Legislation/api/GetLegislationStatusHistoryByLegislationIDAsync/',f'{bill}-status-history.json','POST',legid),
        (f'/LegislationSummary/api/GetLegislationSummaryByIDAsync/{legid}',f'{bill}-summary.json','GET',None),
    ]:
        try:
            st,tx=req(base+endpoint,method,payload)
        except Exception as e:
            st,tx='ERR',str(e)
        print(' ',name,st,len(tx))
        (out/name).write_text(tx)
        time.sleep(1)
    for v in vers:
        tid=v.get('LegislationTextID')
        if not tid: continue
        try:
            st,tx=req(base+f'/LegislationText/api/GetLegislationTextByIDAsync/{tid}')
        except Exception as e:
            st,tx='ERR',str(e)
        print(' ',bill,v.get('Version'),tid,st,len(tx))
        (out/f'{bill}-text-{tid}.json').write_text(tx)
        time.sleep(1)
    time.sleep(1)
