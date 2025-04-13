"use client"
import { hudMessageAtom } from "@/lib/atoms"
import { populateStories as doPopulateAction } from "@/lib/db/populate"
import { locale } from "@/lib/utils"
import SaveAltIcon from "@mui/icons-material/SaveAlt"
import ScienceIcon from "@mui/icons-material/Science"
import { Divider, Fab, IconButton, ListSubheader } from "@mui/material"
import Menu, { MenuProps } from "@mui/material/Menu"
import MenuItem from "@mui/material/MenuItem"
import { alpha, styled } from "@mui/material/styles"
import { useAtom } from "jotai"
import * as React from "react"
import { useState } from "react"
import { HudMessageTypeEnum } from "../HudMessage"
import { PopulateActionType } from "@/lib/defs"
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';

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


export default function PopulateActionMenu() {
  
  const [,setHudMessage] = useAtom(hudMessageAtom)
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

  async function handlePopulateAction(type: PopulateActionType)
  {
    try { await doPopulateAction(type); setHudMessage({message: "Debug panel action was successful! (you may need to refresh)", type: HudMessageTypeEnum.GOOD}) }
    catch (err) { setHudMessage({message: (err as Error).message, type: HudMessageTypeEnum.BAD}) }
  }


  return (
    <>
      <Fab
        onClick={handleClick}
        size="small"
        sx={{ ml: 2 }}
        aria-controls={open ? "account-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
      >
        <ScienceIcon />
      </Fab>

      <StyledMenu
        id="demo-customized-menu"
        MenuListProps={{
          "aria-labelledby": "demo-customized-button",
        }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
      >
        
        <ListSubheader>{locale("populate.header.story")}</ListSubheader>
        <MenuItem onClick={() => handlePopulateAction(PopulateActionType.GUEST)}>
          <AddCircleOutlineIcon />
          {locale(`populate.story.guest`)}
        </MenuItem>
        <MenuItem onClick={() => handlePopulateAction(PopulateActionType.FIXED_GENRE)}>
          <AddCircleOutlineIcon />
          {locale(`populate.story.fixed_genre`)}
        </MenuItem>
        <MenuItem onClick={() => handlePopulateAction(PopulateActionType.RANDOM_GENRES)}>
          <AddCircleOutlineIcon />
          {locale(`populate.story.random_genres`)}
        </MenuItem>
        
        <ListSubheader>{locale("populate.header.delete")}</ListSubheader>
        <MenuItem onClick={() => handlePopulateAction(PopulateActionType.DELETE_ALL_STORIES)}>
          <RemoveCircleOutlineIcon />
          {locale(`populate.delete.stories`)}
        </MenuItem>
        <MenuItem onClick={() => handlePopulateAction(PopulateActionType.DELETE_ALL_ACTIVITY)}>
          <RemoveCircleOutlineIcon />
          {locale(`populate.delete.activity`)}
        </MenuItem>
        <MenuItem onClick={() => handlePopulateAction(PopulateActionType.DELETE_ALL_RATINGS)}>
          <RemoveCircleOutlineIcon />
          {locale(`populate.delete.ratings`)}
        </MenuItem>


      </StyledMenu>
    </>
  )
}
