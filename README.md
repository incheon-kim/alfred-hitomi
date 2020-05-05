# alfred-hitomi
hitomi.la downloader for Alfred 4, macOS


## install
```
$ npm install --global alfred-hitomi
```
## dependencies
node.js가 설치되어있으며 $PATH에 추가되어 있어야합니다. (nvm을 통해 설치한 node.js도 무관)

## ht
브라우저로 부터(Safari,Chrome,Edge) 현재 탭의 URL을 읽어오거나 "ht 주소" 형태로 입력하면 선택지가 출력됩니다.  
선택한 항목의 다운로드가 자동으로 시작됩니다. (최대 동시 다운로드 수 : 2)  

## hp
현재 다운로드 되고 있는 항목의 상태와, 다운로드 순서를 기다리고 있는 항목의 갯수가 표시됩니다.

## htclean
오류 또는 너무 느린 다운로드 속도 때문에 취소해야할일이 있을때 모든 다운로드 작업을 중지합니다.

## hdebug
pid 와 현재 다운로드 항목의 상태(downloading, pending)를 보여줍니다.
