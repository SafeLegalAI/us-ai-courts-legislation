import json,time,urllib.request
from pathlib import Path
base='https://lis.virginia.gov'
headers={'WebAPIKey':'FCE351B6-9BD8-46E0-B18F-5572F4CCA5B9','User-Agent':'SafeLegalAI-Bot/1.0 (+https://safelegalai.com/datasets; hello@safelegalai.com)','content-type':'application/json; charset=utf-8'}
out=Path('work/sources/va')
def req(url, method='GET', payload=None):
    data=json.dumps(payload).encode() if payload is not None else None
    r=urllib.request.Request(url,data=data,headers=headers,method=method)
    with urllib.request.urlopen(r,timeout=60) as resp:
        return resp.status, resp.read().decode('utf-8','ignore')
for bill in ['HB1642','HB2433','HB2692']:
    vers=json.loads((out/f'{bill}-versions.json').read_text()).get('LegislationsVersion') or []
    legid=vers[0]['LegislationID']
    for endpoint,name in [
        (f'/LegislationEvent/api/GetLegislationEventByLegislationIDAsync/?legislationID={legid}',f'{bill}-events.json'),
        (f'/Legislation/api/GetLegislationStatusHistoryByLegislationIDAsync/?legislationID={legid}',f'{bill}-status-history-get.json'),
    ]:
        try: st,tx=req(base+endpoint)
        except Exception as e: st,tx='ERR',str(e)
        print(bill,name,st,len(tx)); (out/name).write_text(tx); time.sleep(1)
    for v in vers:
        tid=v.get('LegislationTextID')
        try: st,tx=req(base+f'/LegislationText/api/GetLegislationTextByIDAsync?legislationTextID={tid}')
        except Exception as e: st,tx='ERR',str(e)
        print(bill,v.get('Version'),tid,st,len(tx)); (out/f'{bill}-text-{tid}.json').write_text(tx); time.sleep(1)
