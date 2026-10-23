# 육가공마케팅팀 2026 OKR 대시보드

GitHub Pages 정적 대시보드입니다. `main` 브랜치 루트에서 배포합니다.

- `index.html`: 기본 화면, 2026년 4분기 (10~12월)
- `quarters/q1.html`, `q2.html`, `q3.html`: 분기 선택으로 조회하는 과거 등록 자료
- `data/2026-q4.json`: 첨부 Excel의 B9:I30을 원문 추출한 데이터 및 출처 SHA-256
- `tests/dashboard.cjs`: 실제 Chromium으로 원문 일치, 분기 전환, 개인 탭, 펼침/접기, 화면 너비와 JavaScript 오류 검사

## 출처와 반영 원칙

4분기: `진주햄_분기별_OKR_등록양식_26년_4분기_육가공마케팅팀.xlsx`, `1. OKR 계획 시트(양식)`, 작성일 26.10.02.
병합 셀의 팀원·목표를 하위 KR에 연결했습니다. 3명, 목표 10개, KR 22개이며 목표·KR·설명·KPI 연계·효율성/혁신성 표시는 원문을 유지했습니다. 원본에 없는 핵심/보조 등급을 생성하지 않습니다. 직급 및 연간 KPI는 기존 대시보드 내용을 유지합니다.

과거 자료는 저장소 당시 화면을 복원했습니다. 재작성이나 4분기 자료의 역적용이 아닙니다.
- 1분기: `cacca88`
- 2분기: `3c506e0`
- 3분기: `b29947b`

분기 선택은 해당 정적 HTML로 이동합니다. 루트 URL에 새로 접속하면 항상 4분기입니다.

## 검증

```sh
npm ci
npx playwright install chromium
python3 -m http.server 8766 --bind 127.0.0.1
# 다른 터미널
npm test
```

실제 배포 검사: `OKR_URL=https://sunghanbok-sudo.github.io/Jinju-OKR/ npm test`.
