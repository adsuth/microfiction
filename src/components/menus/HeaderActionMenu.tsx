import { locale } from "@/lib/utils"
import { UserProfile, useUser } from "@auth0/nextjs-auth0/client"
import ContentCopyIcon from "@mui/icons-material/ContentCopy"
import EditIcon from "@mui/icons-material/Edit"
import LoginIcon from "@mui/icons-material/Login"
import LogoutIcon from "@mui/icons-material/Logout"
import { Avatar, IconButton } from "@mui/material"
import Divider from "@mui/material/Divider"
import Menu, { MenuProps } from "@mui/material/Menu"
import MenuItem from "@mui/material/MenuItem"
import { alpha, styled } from "@mui/material/styles"
import * as React from "react"
import { useEffect, useState } from "react"
import SaveAltIcon from "@mui/icons-material/SaveAlt"
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents"
import ClaimStoryDialog from "../dialog/ClaimStoryDialog"
import LeaderBoard from "../dialog/LeaderBoard"
import BareLink from "../misc/BareLink"
import AboutDialog from "../dialog/AboutDialog"
import InfoIcon from '@mui/icons-material/Info';

//#region Styles
const StyledMenu = styled((props: MenuProps) => (
  <Menu
    elevation={0}
    anchorOrigin={{
      vertical: "bottom",
      horizontal: "right",
    }}
    transformOrigin={{
      vertical: "top",
      horizontal: "right",
    }}
    {...props}
  />
))(({ theme }) => ({
  "& .MuiPaper-root": {
    borderRadius: 6,
    marginTop: theme.spacing(1),
    minWidth: 180,
    color: "rgb(55, 65, 81)",
    boxShadow:
      "rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px",
    "& .MuiMenu-list": {
      padding: "4px 0",
    },
    "& .MuiMenuItem-root": {
      "& .MuiSvgIcon-root": {
        fontSize: 18,
        color: theme.palette.text.secondary,
        marginRight: theme.spacing(1.5),
      },
      "&:active": {
        backgroundColor: alpha(
          theme.palette.primary.main,
          theme.palette.action.selectedOpacity
        ),
      },
    },
    ...theme.applyStyles("dark", {
      color: theme.palette.grey[300],
    }),
  },
}))
//#endregion

export default function HeaderActionMenu() {
  const { user, isLoading } = useUser()

  const [authOption, setAuthOption] = useState("login")
  const [openClaimStoryDialog, setOpenClaimStoryDialog] = useState(false)
  const [openLeaderboard, setOpenLeaderboard] = useState(false)
  const [openAbout, setOpenAbout] = useState(false)

  //#region Modal handlers
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }
  //#endregion

  useEffect(() => {
    if (!isLoading) setAuthOption(user ? "logout" : "login")
  }, [isLoading])

  return (
    <div>
      <ClaimStoryDialog
        open={openClaimStoryDialog}
        setOpen={setOpenClaimStoryDialog}
        user={user as UserProfile}
      />
      <LeaderBoard open={openLeaderboard} setOpen={setOpenLeaderboard} />
      <AboutDialog open={openAbout} setOpen={setOpenAbout} />

      <IconButton
        onClick={handleClick}
        size="small"
        sx={{ ml: 2 }}
        aria-controls={open ? "account-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
      >
        <Avatar src={user ? (user.picture as string) : ""} />
      </IconButton>

      <StyledMenu
        id="demo-customized-menu"
        MenuListProps={{
          "aria-labelledby": "demo-customized-button",
        }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
      >
        <BareLink href="/create">
          <MenuItem onClick={handleClose}>
            <EditIcon />
            {locale("header.menu.create")}
          </MenuItem>
        </BareLink>

        <BareLink href="/stories">
          <MenuItem onClick={handleClose}>
            <ContentCopyIcon />
            {locale("header.menu.stories")}
          </MenuItem>
        </BareLink>

        <Divider sx={{ my: 0.5 }} />

        <MenuItem
          onClick={() => setOpenClaimStoryDialog(true)}
          disabled={!user}
        >
          <SaveAltIcon />
          {locale(`header.menu.claim_story`)}
        </MenuItem>

        <Divider sx={{ my: 0.5 }} />

        <MenuItem onClick={() => setOpenLeaderboard(true)}>
          <EmojiEventsIcon />
          {locale(`header.menu.leaderboard`)}
        </MenuItem>
        <MenuItem onClick={() => setOpenAbout(true)}>
          <InfoIcon />
          {locale(`header.menu.about`)}
        </MenuItem>

        <Divider sx={{ my: 0.5 }} />

        <BareLink href={`/api/auth/${authOption}`}>
          <MenuItem onClick={handleClose}>
            {user ? <LogoutIcon /> : <LoginIcon />}
            {locale(`header.menu.${authOption}`)}
          </MenuItem>
        </BareLink>
      </StyledMenu>
    </div>
  )
}
