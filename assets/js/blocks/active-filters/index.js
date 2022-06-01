/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';
import { createBlock, registerBlockType } from '@wordpress/blocks';
import { toggle } from '@woocommerce/icons';
import { Icon } from '@wordpress/icons';
import classNames from 'classnames';
import { useBlockProps } from '@wordpress/block-editor';

/**
 * Internal dependencies
 */
import edit from './edit.js';
import metadata from './block.json';

registerBlockType( metadata, {
	icon: {
		src: (
			<Icon
				icon={ toggle }
				className="wc-block-editor-components-block-icon"
			/>
		),
	},
	transforms: {
		from: [
			{
				type: 'block',
				blocks: [ 'core/legacy-widget' ],
				// We can't transform if raw instance isn't shown in the REST API.
				isMatch: ( { idBase, instance } ) =>
					idBase === 'woocommerce_layered_nav_filters' &&
					!! instance?.raw,
				transform: ( { instance } ) =>
					createBlock( 'woocommerce/active-filters', {
						displayStyle: 'list',
						heading:
							instance?.raw?.title ||
							__(
								'Active filters',
								'woo-gutenberg-products-block'
							),
						headingLevel: 3,
					} ),
			},
		],
	},
	edit,
	// Save the props to post content.
	save( { attributes } ) {
		const { className, displayStyle, heading, headingLevel } = attributes;
		const data = {
			'data-display-style': displayStyle,
			'data-heading': heading,
			'data-heading-level': headingLevel,
		};

		return (
			<div
				{ ...useBlockProps.save( {
					className: classNames( 'is-loading', className ),
				} ) }
				{ ...data }
			>
				<span
					aria-hidden
					className="wc-block-active-product-filters__placeholder"
				/>
			</div>
		);
	},
} );
