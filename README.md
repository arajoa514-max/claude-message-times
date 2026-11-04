# message-times · 내 메시지 시간 패널

Claude Code 대화창 옆에 **내가 보낸 메시지와 보낸 시각(한국 시간)** 을 보여 주는 패널입니다.
Claude 앱 대화 화면에는 메시지별 시간이 표시되지 않아서, "그 얘기를 몇 시에 했더라?"를 바로 확인할 수 있게 만들었습니다.

A Claude Code mod that keeps a pane beside the chat listing the messages you sent in this session, each with the time it was sent (Korea Standard Time).

## 보이는 모습

```
11/04 09:31  회의 자료 표 부분만 다시 정리해줘
11/04 09:23  어제 만든 보고서 초안 열어줘
11/03 14:02  변경 사항 커밋하고 푸시해줘
```

- 최신 메시지가 맨 위에 오고, 새 메시지를 보낼 때마다 자동으로 추가됩니다.
- 직접 입력한 메시지만 기록합니다. 백그라운드 알림, 슬래시 명령, 다른 플러그인이 보낸 메시지는 빠집니다.
- 긴 메시지는 앞 80자까지만 보여 줍니다.
- 세션마다 따로 기록합니다. 새 세션을 시작하면 빈 목록에서 시작합니다.

## 사용법

- 세션이 시작되면 패널이 자동으로 열립니다.
- 패널을 닫았다가 다시 보려면 대화창에 `/message-times` 를 입력하세요. 닫혀 있던 동안 보낸 메시지도 그대로 남아 있습니다.

## 설치

터미널의 Claude Code 프롬프트에서:

```
/plugin install message-times --marketplace arajoa514-max/claude-message-times
```

마켓플레이스를 추가할지 물으면 `y`, 설치 범위는 사용자(user)를 고르면 됩니다. 설치가 끝나면 그 세션부터 바로 동작합니다.

셸에서:

```bash
claude plugin install message-times --marketplace arajoa514-max/claude-message-times
```

Claude 데스크톱 앱에서는 프롬프트 입력창 옆 **+** → **Plugins** → **Add marketplace** 에 `arajoa514-max/claude-message-times` 를 넣은 다음 **Add plugin** 으로 추가합니다.

## 구성

| 파일 | 역할 |
|---|---|
| `hooks/register.tsx` | 메시지 기록, 패널 그리기, `/message-times` 명령 |
| `types/index.d.ts` | 세션에 저장하는 값(보낸 시각, 메시지 앞부분)의 형식 |
| `.claude-plugin/plugin.json` | 모드 정보 |
| `.claude-plugin/marketplace.json` | 이 저장소에서 바로 설치할 수 있게 하는 목록 |

기록은 Claude Code 세션 상태에만 저장되며, 외부로 전송하지 않습니다.

## 라이선스

MIT
