"use client"
import { GenrePicker } from "@/components/GenrePicker"
import PageLoading from "@/components/skeletons/PageLoading"
import { guestLastPostedAtom, hudMessageAtom } from "@/lib/atoms"
import { db_createNewStory } from "@/lib/db/post"
import { GUEST_UPLOAD_TIMEOUT, GUEST_USER_ID } from "@/lib/decs"
import { Genre, PublishedStoryType, Visibility } from "@/lib/defs"
import { inferVisibility, locale, timeDifference } from "@/lib/utils"
import { useUser } from "@auth0/nextjs-auth0/client"
import { CopyField } from "@eisberg-labs/mui-copy-field"
import {
  Button,
  ButtonGroup,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  Grid2,
  Stack,
  Switch,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material"
import { useAtom } from "jotai"
import { useEffect, useState } from "react"
import { HudMessageTypeEnum } from "../../components/HudMessage"

async function tryPublish(story: any) {
  return db_createNewStory(story)
}

export default function Create() {
  const [title, setTitle] = useState<string>("")
  const [blurb, setBlurb] = useState<string>("")
  const [content, setContent] = useState<string>("")
  const [genre, setGenre] = useState<number>(Genre.NONE)
  const [visibility, setVisibility] = useState<Visibility>(Visibility.PUBLIC)
  const [userId, setUserId] = useState(GUEST_USER_ID)

  const [storyId, setStoryId] = useState<string>()
  const [guestLastPosted, setGuestLastPosted] = useAtom(guestLastPostedAtom)

  const [, setHudMessage] = useAtom(hudMessageAtom)
  const { user, isLoading } = useUser()

  // for determining if we are logged in or not.
  // we SHOULD be able to post a story when not logged in...
  useEffect(() => {
    if (isLoading) return
    if (!user)
      setHudMessage({
        message: locale("create.hud.posting_as_guest"),
        type: HudMessageTypeEnum.WARN,
        time: Infinity,
      })

    setUserId(user?.sub ?? GUEST_USER_ID)
  }, [isLoading])

  // if we are still awaiting the user, show loading page.
  if (isLoading) {
    return <PageLoading />
  }

  //#region Action Handlers
  function canGuestPost() {
    // non guest, proceed
    if (userId && userId !== GUEST_USER_ID) return true

    // guest not posted in session, proceed
    if (!guestLastPosted) {
      setGuestLastPosted(Date.now())
      return true
    }

    // guest cannot post within 5 mins
    const timeDiff = timeDifference(guestLastPosted, Date.now())
    if (timeDiff > GUEST_UPLOAD_TIMEOUT) {
      setHudMessage({
        message: `${locale("create.guest.timeout_start")} ${timeDiff} ${locale(
          "create.guest.timeout_end"
        )}`,
        type: HudMessageTypeEnum.BAD,
      })
      return false
    }

    setGuestLastPosted(Date.now())
    return true
  }
  function handlePublish() {
    if (!canGuestPost()) return

    const story = {
      title,
      blurb,
      content,
      genre,
      visibility,
      userId,
    }
    tryPublish(story)
      .then((publishedStory: PublishedStoryType) => {
        if (publishedStory.userId === GUEST_USER_ID) {
          setStoryId(publishedStory.storyId)
          return
        }
        setHudMessage({
          message: locale("create.success.publish"),
          type: HudMessageTypeEnum.GOOD,
        })
        window.location.href = "/"
      })
      .catch((error) => {
        setHudMessage({
          message: error.message,
          type: HudMessageTypeEnum.BAD,
        })
      })
  }

  function handleDiscard() {
    setHudMessage({
      message: locale("create.success.discard"),
      type: HudMessageTypeEnum.INFO,
    })
    window.location.href = "/"
  }
  //#endregion

  return (
    <>
      <Dialog open={!!storyId}>
        <DialogTitle>{locale("create.guest.title")}</DialogTitle>
        <DialogContent>
          <Stack direction={"column"} gap={2}>
            <Typography variant="body1" color="initial">
              {locale("create.guest.body")}
            </Typography>
            <CopyField
              value={storyId}
              onCopySuccess={() => {
                setHudMessage({
                  message: locale("create.guest.copied"),
                  type: HudMessageTypeEnum.GOOD,
                  time: 2000,
                })
              }}
              copyTooltip={locale("create.guest.tooltip")}
            />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ m: "auto" }}>
          <Button
            onClick={() => {
              window.location.href = "/"
            }}
            color="primary"
          >
            {locale("create.guest.confirm")}
          </Button>
        </DialogActions>
      </Dialog>

      <form
        onSubmit={(e) => {
          e.preventDefault()
          // handleSave()
        }}
      >
        <Stack gap={4} sx={{ p: 16, m: "auto" }}>
          <Tooltip
            placement="bottom-start"
            title={locale("create.tooltip.title")}
          >
            <TextField
              label={locale("create.labels.title")}
              variant="standard"
              value={title}
              slotProps={{ htmlInput: { maxLength: 50 } }}
              required
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                setTitle(event.target.value)
              }}
            />
          </Tooltip>

          <Tooltip
            placement="bottom-start"
            title={locale("create.tooltip.blurb")}
          >
            <TextField
              label={locale("create.labels.blurb")}
              variant="outlined"
              slotProps={{ htmlInput: { maxLength: 50 } }}
              value={blurb}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                setBlurb(event.target.value)
              }}
            />
          </Tooltip>

          <Grid2
            container
            spacing={1}
            direction="row"
            justifyContent="center"
            alignItems="center"
            alignContent="center"
            wrap="wrap"
          >
            <Tooltip
              placement="bottom-start"
              title={locale(
                `create.tooltip.visibility_${
                  visibility === Visibility.PUBLIC ? "on" : "off"
                }`
              )}
            >
              <FormControlLabel
                labelPlacement="bottom"
                label={locale(
                  `create.labels.visibility_${
                    visibility === Visibility.PUBLIC ? "on" : "off"
                  }`
                )}
                control={
                  <Switch
                    disabled={userId === GUEST_USER_ID}
                    value={visibility === Visibility.PUBLIC}
                    checked={visibility === Visibility.PUBLIC}
                    onChange={(ev) =>
                      setVisibility(inferVisibility(ev.target.checked))
                    }
                  />
                }
              />
            </Tooltip>
            <GenrePicker genre={genre} setGenre={setGenre} />
          </Grid2>
          <TextField
            label={locale("create.labels.content")}
            minRows={5}
            slotProps={{ htmlInput: { maxLength: 500 } }}
            multiline
            value={content}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              setContent(event.target.value)
            }}
          />
          <Stack direction={"row"} sx={{ m: "auto" }}>
            <ButtonGroup variant="text" color="primary">
              <Button type="button" onClick={handleDiscard}>
                {locale("create.actions.discard")}
              </Button>
              <Button type="button" onClick={handlePublish}>
                {locale("create.actions.publish")}
              </Button>
            </ButtonGroup>
          </Stack>
        </Stack>
      </form>
    </>
  )
}
