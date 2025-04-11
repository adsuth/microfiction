import { Genre } from "@/lib/defs"
import {
  genreStringToNumber,
  getAllGenres,
  getGenreIconClass,
  getGenreNorm,
  locale,
} from "@/lib/utils"
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material"

interface GenrePickerProps {
  genre: Genre
  setGenre: any
}

export function GenrePicker(props: GenrePickerProps) {
  const { genre, setGenre } = props

  return (
    <FormControl fullWidth>
      <InputLabel id="genre-picker-label">
        {locale("create.labels.genre")}
      </InputLabel>
      <Select
        labelId="genre-picker-label"
        id="genre-picker"
        value={genre ?? Genre.NONE}
        onChange={(ev) => {
          setGenre(ev.target.value);
        }}
        label={locale("create.labels.genre")}
        renderValue={(selected) =>
          selected === Genre.NONE ? "" : renderGenreItem(selected)
        }
      >
        {getAllGenres(true).map((genre) => renderGenreItem(genre))}
      </Select>
    </FormControl>
  )
}

function renderGenreItem(genre: Genre | string) {
  if (typeof genre === "string") genre = genreStringToNumber(genre)

  const GenreIcon = getGenreIconClass(genre)
  return (
    <MenuItem key={genre} value={genre}>
      {GenreIcon ? <GenreIcon /> : <></>}&nbsp;&nbsp;{getGenreNorm(genre)}
    </MenuItem>
  )
}
