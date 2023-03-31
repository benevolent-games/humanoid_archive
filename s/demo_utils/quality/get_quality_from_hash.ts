
export function get_quality_from_hash(hash: string) {
	return (
		hash.startsWith("#quality=")
			? hash.match(/^#quality=(.*)$/)![1]
			: "low"
	) ?? "low"
}
