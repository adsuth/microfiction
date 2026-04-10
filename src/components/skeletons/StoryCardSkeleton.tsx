import { Card, Skeleton, CardContent, Rating } from "@mui/material"

export default function StoryCardSkeleton() {
  // rounded | rectangular | circular | text
  // <Skeleton variant="rectangular" width={210} height={118} />
  return (
    <Card
      sx={{
        display: "flex",
        mt: 2,
        width: "auto",
        gridTemplateColumns: "1fr 4fr",
        borderRadius: 4,
      }}
    >
      <Skeleton
        variant="rectangular"
        height={"100%"}
        sx={{ aspectRatio: "1/1" }}
      />

      {/* Content Section */}
      <CardContent sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <Skeleton variant="text" sx={{ fontSize: "2rem" }} />

        <Skeleton variant="text" sx={{ fontSize: "1rem" }} />
        <Skeleton variant="text" sx={{ fontSize: "1rem" }} />
        <Skeleton variant="text" sx={{ fontSize: "1rem" }} />

        {/* Rating Section */}
        <Rating value={0} precision={0.5} readOnly />

        {/* Metadata Section */}
        <Skeleton variant="text" sx={{ fontSize: "2rem" }} />
      </CardContent>

      {/* todo: add avatar */}
    </Card>
  )
}
