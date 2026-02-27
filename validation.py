from pydantic import BaseModel
from typing import List, Dict


class WebContent(BaseModel):
    title: str
    url: str # Note: In your JS, you sent 'document' (an object), fix that to 'location.href'
    allText: str
    links: List[Dict[str, str]]

class AnalyzeRequest(BaseModel):
    userinput: str
    web_content: WebContent