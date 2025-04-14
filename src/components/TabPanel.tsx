import { Box } from "@mui/material"

interface TabPanelProps {
  children?: React.ReactNode
  index: number
  value: number
}

export function TabPanel(props: TabPanelProps) {
  const { children, value, index } = props

  return (
    <div role="tabpanel" hidden={value !== index}>
      {value === index && (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
            paddingTop: 2,
            w: "100%",
          }}
        >
          {children}
        </Box>
      )}
    </div>
  )
}