import { staticFile } from 'remotion';

let loading: Promise<void> | undefined;

/** Public demo substitutes OFL Montserrat for the original unbundled fonts. */
export const loadPublicFonts = (): Promise<void> => {
	if (!loading) {
		loading = Promise.all(
			[
				['TheBoldFont', '700'],
				['NullFont', '700'],
				['GitchFont', '700'],
				['GaretBook', '400'],
				['GaretHeavy', '700'],
				['Quantico', '400'],
				['Montserrat', '400'],
				['MontserratBold', '700'],
			].map(async ([family, weight]) => {
				const font = new FontFace(
					family,
					`url('${staticFile('fonts/Montserrat.ttf')}') format('truetype')`,
					{ weight },
				);
				document.fonts.add(await font.load());
			}),
		)
			.then(() => undefined)
			.catch((error) => {
				loading = undefined;
				throw error;
			});
	}
	return loading;
};
