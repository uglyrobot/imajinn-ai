<?php
/**
 * Plugin Name:       Imajinn AI
 * Description:       Generate the perfect images for your blog in seconds with cutting-edge AI. The Imajinn Block brings AI image generation previously only seen on restricted platforms like DALL·E 2 right into the backend of your website so you can create stunning images for any topic with just your imagination.
 * Requires at least: 6.0
 * Requires PHP:      7.2
 * Version:           1.5.4
 * Author:            Imajinn AI
 * Author URI:        https://imajinn.ai
 * Plugin URI:        https://infiniteuploads.com/imajinn/
 * License:           GPL-2.0-or-later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       imajinn-ai
 *
 * @package           imajinn-ai
 *
 * Copyright 2022 UglyRobot, LLC. All rights reserved.
 *
 * Developers: Aaron Edwards @UglyRobotDev
 */

define( 'IMAJINN_AI_VERSION', '1.5.4' );

class Imajinn_AI {

	private static $instance;

	/**
	 * @return Imajinn_AI
	 */
	public static function instance() {

		if ( ! self::$instance ) {
			self::$instance = new Imajinn_AI();
		}

		return self::$instance;
	}

	public function __construct() {

		if ( ! defined( 'IMAJINN_API_URL' ) ) {
			define( 'IMAJINN_API_URL', 'https://infiniteuploads.com/api/imajinn/v1/' );
		}

		add_action( 'init', [ &$this, 'block_init' ] );
		add_action( 'enqueue_block_editor_assets', [ &$this, 'inline_script' ] );

		add_action( 'init', [ &$this, 'register_post_type' ] );

		add_action( 'admin_menu', [ &$this, 'admin_menu' ] );

		add_filter( 'plugin_action_links_imajinn-ai/imajinn-ai.php', [ &$this, 'plugins_list_links' ] );
		add_filter( 'network_admin_plugin_action_links_imajinn-ai/imajinn-ai.php', [ &$this, 'plugins_list_links' ] );

		add_action( 'wp_ajax_imajinn-connect', [ &$this, 'ajax_connect' ] );
		add_action( 'wp_ajax_imajinn-refresh', [ &$this, 'ajax_refresh' ] );
		add_action( 'wp_ajax_imajinn-account-url', [ &$this, 'ajax_get_account_url' ] );
		add_action( 'wp_ajax_imajinn-start-job', [ &$this, 'ajax_start_job' ] );
		add_action( 'wp_ajax_imajinn-check-job', [ &$this, 'ajax_check_job' ] );
		add_action( 'wp_ajax_imajinn-cancel-job', [ &$this, 'ajax_cancel_job' ] );
		add_action( 'wp_ajax_imajinn-face-repair', [ &$this, 'ajax_face_repair' ] );
		add_action( 'wp_ajax_imajinn-create-prompts', [ &$this, 'ajax_create_prompts' ] );
		add_action( 'wp_ajax_imajinn-save-image', [ &$this, 'ajax_save_image' ] );
		add_action( 'wp_ajax_imajinn-tweet', [ &$this, 'ajax_tweet_url' ] );
		add_action( 'wp_ajax_imajinn-dismiss-welcome', [ &$this, 'ajax_dismiss_welcome' ] );
	}

	/**
	 * Registers the block using the metadata loaded from the `block.json` file.
	 * Behind the scenes, it registers also all assets so they can be enqueued
	 * through the block editor in the corresponding context.
	 *
	 * @see https://developer.wordpress.org/reference/functions/register_block_type/
	 */
	function block_init() {
		if ( current_user_can( 'upload_files' ) ) {
			register_block_type( __DIR__ . '/build/block.json' );
		}
	}

	/**
	 * Register our prompt history post type for internal use.
	 * This is used to store the history of prompts that have been used.
	 *
	 * @return void
	 */
	public function register_post_type() {
		register_post_type( 'imajinn_prompt', [
			'public'              => false,
			'show_ui'             => false,
			'show_in_menu'        => false,
			'show_in_nav_menus'   => false,
			'show_in_admin_bar'   => false,
			'can_export'          => true,
			'has_archive'         => false,
			'exclude_from_search' => true,
			'publicly_queryable'  => false,
			'capability_type'     => 'post',
			'supports'            => false,
			'rewrite'             => false,
		] );
	}

	/**
	 * Adds support link to plugin row.
	 */
	function plugins_list_links( $actions ) {
		// Create the link.
		$custom_links             = [];
		$custom_links['support']  = '<a href="' . esc_url( 'mailto:genie@imajinn.ai' ) . '">' . esc_html__( 'Support', 'imajinn-ai' ) . '</a>';
		$custom_links['generate'] = '<a href="' . admin_url( 'upload.php?page=imajinn-ai' ) . '">' . esc_html__( 'Generate', 'imajinn-ai' ) . '</a>';

		// Adds the links to the beginning of the array.
		return array_merge( $custom_links, $actions );
	}

	/**
	 * Enqueue the block's assets for the editor.
	 *
	 * @see https://developer.wordpress.org/block-editor/tutorials/block-tutorial/applying-styles-with-stylesheets/
	 *
	 * @param bool $custom_editor Whether this is for the custom editor.
	 */
	function inline_script( $custom_editor = false ) {
		if ( $this->is_connected() ) {
			$site_id      = $this->get_site_id();
			$expire       = strtotime( '+1 day' );
			$auth         = hash( 'sha256', $site_id . $expire . hash( 'sha256', $this->get_api_key() ) );
			$checkout_url = add_query_arg( compact( [ 'site_id', 'expire', 'auth' ] ), 'https://infiniteuploads.com/imajinn/checkout/' );
		} else {
			$checkout_url = 'https://infiniteuploads.com/imajinn/checkout/';
		}

		//get history from post type
		$history = [];
		$posts   = get_posts( [
			'post_type'      => 'imajinn_prompt',
			'post_status'    => 'publish',
			'posts_per_page' => 20,
			'orderby'        => 'date',
			'order'          => 'DESC',
		] );
		foreach ( $posts as $post ) {
			$prompt = json_decode( $post->post_content, true );
			if ( $prompt ) { //ignore invalid json
				$history[] = $prompt;
			}
		}

		$data = array(
			'connected'         => $this->is_connected(),
			'remaining_credits' => $this->get_site_data( 'remaining_credits' ),
			'email'             => ! $this->is_connected() ? wp_get_current_user()->user_email : null, //for prefilling the registration form
			'nonce'             => wp_create_nonce( 'imajinn-ai' ),
			'checkout_url'      => $checkout_url,
			'history'           => $history,
			'custom_editor'     => $custom_editor,
			'show_welcome'      => ! get_user_option( 'imajinn_dismiss_welcome', get_current_user_id() ),
		);
		wp_add_inline_script( 'infinite-uploads-imajinn-ai-editor-script', 'let IMAJINN = ' . json_encode( $data ) . ';' );
	}

	public function admin_menu() {
		$page = add_media_page( 'Imajinn AI', 'Imajinn AI', 'upload_files', 'imajinn-ai', [ &$this, 'admin_page' ] );
		add_action( 'admin_print_styles-' . $page, [ &$this, 'admin_styles' ] );
		add_action( 'admin_print_scripts-' . $page, [ &$this, 'admin_scripts' ] );
	}

	public function admin_styles() {
		wp_enqueue_style( 'infinite-uploads-imajinn-ai-editor-style' );

		$script_path       = plugins_url( 'build/editor.css', __FILE__ );
		$script_asset_path = dirname( __FILE__ ) . '/build/editor.asset.php';
		$script_asset      = file_exists( $script_asset_path )
			? require $script_asset_path
			: array(
				'dependencies' => array(),
				'version'      => filemtime( $script_path ),
			);
		wp_enqueue_style( 'imajinn-ai', $script_path, [ 'wp-components', 'wp-block-editor', 'wp-editor', 'wp-format-library' ], IMAJINN_AI_VERSION );
	}

	public function admin_scripts() {
		$this->inline_script( true );
		wp_enqueue_script( 'infinite-uploads-imajinn-ai-editor-script' );

		// Enqueue scripts with @wordpress package deps extracted via `@wordpress/wp-scripts
		// See:
		// - https://developer.wordpress.org/block-editor/packages/packages-scripts/#webpack-config
		// - https://developer.wordpress.org/block-editor/packages/packages-dependency-extraction-webpack-plugin/
		$script_path       = 'build/editor.js';
		$script_asset_path = dirname( __FILE__ ) . '/build/editor.asset.php';
		$script_asset      = file_exists( $script_asset_path )
			? require $script_asset_path
			: array(
				'dependencies' => array(),
				'version'      => filemtime( $script_path ),
			);
		$script_url        = plugins_url( $script_path, __FILE__ );

		wp_enqueue_script( 'imajinn-ai', $script_url, $script_asset['dependencies'], $script_asset['version'] );
	}

	function admin_page() {
		?>
		<div
			id="imajinn-block-editor"
			class="imajinn-block-editor"
		>
			<?php esc_html_e( 'Loading Editor...', 'imajinn-ai' ); ?>
		</div>
		<?php
	}

	/**
	 * ajax request.
	 *
	 * @return void
	 */
	public function ajax_connect() {
		// check caps
		$params = $this->check_ajax();

		$email = sanitize_text_field( $params['email'] );
		if ( empty( $email ) || ! is_email( $email ) ) {
			wp_send_json_error( new WP_Error( 'bad_email', esc_html__( 'Please enter a valid email address.', 'imajinn-ai' ) ) );
		}

		$password = sanitize_text_field( $params['password'] );
		if ( empty( $password ) ) {
			wp_send_json_error( new WP_Error( 'bad_password', esc_html__( 'Please enter a password.', 'imajinn-ai' ) ) );
		}

		if ( ! $params['signup_tos'] ) {
			wp_send_json_error( new WP_Error( 'tos_agree', esc_html__( 'Please agree to our Terms of Service.', 'imajinn-ai' ) ) );
		}

		$signup_newsletter = (bool) $params['signup_newsletter'];
		$domain            = network_site_url();

		$params = compact( 'email', 'password', 'signup_newsletter', 'domain' );
		if ( $this->get_site_id() ) { //if it was connected before, send same site_id
			$params['site_id'] = $this->get_site_id();
		}

		$result = $this->api_request( 'connect', $params, 'POST' );
		if ( is_wp_error( $result ) ) {
			wp_send_json_error( $result );
		}

		update_site_option( 'imajinn_api_key', $result->api_token );
		update_site_option( 'imajinn_site_id', $result->site_id );
		$this->update_data( $result );

		wp_send_json_success( [ 'remaining_credits' => $result->remaining_credits ] );
	}

	/**
	 * ajax request. Refreshes the site data and credit counts.
	 *
	 * @return void
	 */
	public function ajax_refresh() {
		// check caps
		$params = $this->check_ajax();

		$result = $this->api_request( sprintf( 'site/%s', $this->get_site_id() ), [], 'GET' );
		if ( is_wp_error( $result ) ) {
			wp_send_json_error( $result );
		}

		$this->update_data( $result );

		wp_send_json_success( $result );
	}

	/**
	 * ajax request. Refreshes the site data and credit counts.
	 *
	 * @return void
	 */
	public function ajax_get_account_url() {
		// check caps
		$params = $this->check_ajax();

		$result = $this->api_request( 'account', [], 'GET' );
		if ( is_wp_error( $result ) ) {
			wp_send_json_error( $result );
		}

		wp_send_json_success( $result );
	}

	/**
	 * ajax request.
	 *
	 * @return void
	 */
	public function ajax_start_job() {
		// check caps
		$params = $this->check_ajax();

		$orig_prompt = sanitize_text_field( $params['prompt'] );
		if ( empty( $orig_prompt ) || strlen( $orig_prompt ) < 3 ) {
			wp_send_json_error( new WP_Error( 'bad_prompt', esc_html__( 'Please enter a detailed prompt for generation at least one word long.', 'imajinn-ai' ) ) );
		}

		$prompt_style = trim( sanitize_text_field( $params['prompt_style'] ), " \t\n\r\0\x0B,/." );

		$prompt = $orig_prompt . ' ' . $prompt_style;
		$prompt = substr( $prompt, 0, 500 ); //max 500 chars

		$ratio = sanitize_text_field( $params['ratio'] );
		if ( empty( $ratio ) || ! in_array( $ratio, [ '1:1', '3:2', '2:3' ] ) ) {
			wp_send_json_error( new WP_Error( 'bad_ratio', esc_html__( 'Please choose an image ratio.', 'imajinn-ai' ) ) );
		}

		$num_variations = absint( $params['num_variations'] );

		$init_image = esc_url_raw( $params['init_image'] );

		$mask = trim( $params['mask'] );

		$job = $this->api_request( sprintf( 'site/%s/generate', $this->get_site_id() ), compact( 'prompt', 'ratio', 'num_variations', 'init_image', 'mask' ) );
		if ( is_wp_error( $job ) ) {
			wp_send_json_error( $job );
		}

		$this->update_data( $job );

		$generations = $job->generations;

		//rename vars for saving
		$full_prompt = $prompt;
		$prompt      = $orig_prompt;

		//save to history post type
		wp_insert_post( [
			'post_type'    => 'imajinn_prompt',
			'post_status'  => 'draft',
			'post_title'   => $full_prompt,
			'post_name'    => $job->job_id,
			'post_content' => json_encode( compact( 'prompt', 'prompt_style', 'ratio', 'num_variations', 'generations' ) ),
		] );

		wp_send_json_success( $job );
	}

	function ajax_cancel_job() {
		// check caps
		$params = $this->check_ajax();

		$job_id = sanitize_key( $params['job_id'] );

		$job = $this->api_request( sprintf( 'site/%s/generate/%s', $this->get_site_id(), $job_id ), [], 'DELETE' );
		if ( is_wp_error( $job ) ) {
			wp_send_json_error( $job );
		}

		$this->update_data( $job );

		//update the history post type
		$post = get_page_by_path( $job->job_id, OBJECT, 'imajinn_prompt' );
		if ( $post ) {
			wp_update_post( [
				'ID'           => $post->ID,
				'post_status'  => 'succeeded' == $job->status ? 'publish' : 'trash',
				'post_content' => json_encode( array_merge( json_decode( $post->post_content, true ), [ 'generations' => $job->generations ] ) ),
			] );
		}

		wp_send_json_success( $job );
	}

	function ajax_check_job() {
		$params = $this->check_ajax();

		$job_id = sanitize_key( $params['job_id'] );

		$job = $this->api_request( sprintf( 'site/%s/generate/%s', $this->get_site_id(), $job_id ), [ 'v' => microtime( true ) ], 'GET' );
		if ( is_wp_error( $job ) ) {
			wp_send_json_error( $job );
		}

		$this->update_data( $job );

		if ( 'starting' !== $job->status && 'processing' !== $job->status ) {
			//update the history post type
			$post = get_page_by_path( $job->job_id, OBJECT, 'imajinn_prompt' );
			if ( $post ) {
				$history = array_merge( json_decode( $post->post_content, true ), [ 'generations' => $job->generations ] );
				wp_update_post( [
					'ID'           => $post->ID,
					'post_status'  => 'succeeded' == $job->status ? 'publish' : 'trash',
					'post_content' => json_encode( $history ),
				] );
				$job->history = $history; //return this so we can add to history array
			}
		}

		if ( 'failed' == $job->status ) {
			wp_send_json_error( new WP_Error( 'api_error', $job->failed_reason, $job ) );
		}

		wp_send_json_success( $job );
	}

	function ajax_save_image() {

		// check caps
		$params      = $this->check_ajax();
		$image       = esc_url_raw( $params['url'] );
		$orig_prompt = sanitize_text_field( $params['prompt'] );
		$post_id     = absint( $params['post_id'] );

		$prompt_style = trim( sanitize_text_field( $params['prompt_style'] ), " \t\n\r\0\x0B,/." );
		$prompt       = $orig_prompt . ' ' . $prompt_style;

		$size = 'full';
		//make api call to upscale the image
		$upscaled_result = $this->api_request( sprintf( 'site/%s/upscale', $this->get_site_id() ), compact( 'image', 'prompt' ) );
		if ( ! is_wp_error( $upscaled_result ) && ! empty( $upscaled_result->image ) ) {
			$image = $upscaled_result->image;
			$size  = 'large';
		}

		$attachment_id = media_sideload_image( $image, $post_id, $orig_prompt, 'id' );
		if ( is_wp_error( $attachment_id ) ) {
			wp_send_json_error( $attachment_id );
		}

		//add alt text to attachment
		$alt = wp_strip_all_tags( $prompt, true );
		update_post_meta( $attachment_id, '_wp_attachment_image_alt', wp_slash( $alt ) );

		list( $url, $width, $height ) = wp_get_attachment_image_src( $attachment_id, $size );
		wp_send_json_success( compact( 'attachment_id', 'url', 'width', 'height', 'size' ) );
	}

	function ajax_create_prompts() {

		// check caps
		$params = $this->check_ajax();

		$prompt = sanitize_text_field( $params['prompt'] );

		//make api call to fix the image
		$result = $this->api_request( sprintf( 'site/%s/prompts', $this->get_site_id() ), compact( 'prompt' ) );
		if ( is_wp_error( $result ) ) {
			wp_send_json_error( $result );
		}

		if ( 'failed' == $result->status ) {
			wp_send_json_error( new WP_Error( 'api_error', $result->failed_reason, $result ) );
		}

		wp_send_json_success( $result );
	}

	function ajax_face_repair() {

		// check caps
		$params = $this->check_ajax();

		$image = esc_url_raw( $params['image'] );

		//make api call to fix the image
		$result = $this->api_request( sprintf( 'site/%s/face_repair', $this->get_site_id() ), compact( 'image' ) );
		if ( is_wp_error( $result ) ) {
			wp_send_json_error( $result );
		}

		if ( 'failed' == $result->status ) {
			wp_send_json_error( new WP_Error( 'api_error', $result->failed_reason, $result ) );
		}

		wp_send_json_success( $result );
	}


	/**
	 * Redirects to Twitter with message and image url. Necessary because the block editor force-hides all share links. Nonce not needed because this is a redirect.
	 *
	 * @return void
	 */
	function ajax_tweet_url() {

		// check caps
		if ( ! current_user_can( 'upload_files' ) ) {
			wp_die( new WP_Error( 'permissions', esc_html__( "You don't have permission to do this.", 'imajinn-ai' ) ) );
		}

		$url      = esc_url_raw( $_GET['image'] );
		$text     = urlencode( __( 'I generated this image with the Imajinn AI WordPress plugin!', 'imajinn-ai' ) );
		$via      = 'infiniteuploads';
		$hashtags = 'ImajinnThat,WordPress';
		wp_redirect( add_query_arg( compact( 'text', 'url', 'via', 'hashtags' ), 'https://twitter.com/intent/tweet' ) );
	}

	function ajax_dismiss_welcome() {

		// check caps
		$this->check_ajax();

		update_user_option( get_current_user_id(), 'imajinn_dismiss_welcome', true );
		wp_send_json_success();
	}

	/**
	 * Perform an API request to generate images.
	 *
	 * @param string $path   API path.
	 * @param array  $params Data array.
	 * @param string $method Method. Default: POST.
	 *
	 * @return object|WP_Error
	 */
	private function api_request( $path, $params = [], $method = 'POST' ) {
		$url = IMAJINN_API_URL . ltrim( $path, '/' );

		$headers = array(
			'Accept'           => 'application/json',
			'Content-Type'     => 'application/json',
			'x-plugin-version' => IMAJINN_AI_VERSION,
		);

		if ( $this->get_api_key() ) {
			$headers['Authorization'] = 'Bearer ' . $this->get_api_key();
		}

		$args = array(
			'headers'   => $headers,
			'sslverify' => true,
			'method'    => strtoupper( $method ),
			'timeout'   => 30,
		);

		//log if WP_DEBUG is true
		if ( defined( 'WP_DEBUG' ) && WP_DEBUG ) {
			error_log( 'Imajinn API Request: ' . $url );
			error_log( 'Imajinn API Request Args: ' . var_export( $args, true ) );
		}

		switch ( strtolower( $method ) ) {
			case 'post':
				$args['body'] = wp_json_encode( $params );

				$response = wp_remote_post( $url, $args );
				break;
			case 'get':
				if ( ! empty( $params ) ) {
					$url = add_query_arg( $params, $url );
				}

				$response = wp_remote_get( $url, $args );
				break;
			default:
				if ( ! empty( $params ) ) {
					$args['body'] = wp_json_encode( $params );
				}
				$response = wp_remote_request( $url, $args );
				break;
		}

		if ( is_wp_error( $response ) ) {
			error_log( "Imajinn API Error: " . var_export( $response, true ) );

			return $response;
		}

		$body = json_decode( wp_remote_retrieve_body( $response ) );

		//disconnect from api on invalid_site or invalid_api_key errors
		if ( isset( $body->code ) && ( 'invalid_site' === $body->code || 'invalid_api_key' === $body->code ) ) {
			delete_site_option( 'imajinn_api_key' );
			delete_site_option( 'imajinn_data' );
			if ( 'invalid_site' === $body->code ) {
				delete_site_option( 'imajinn_site_id' );
			}
		}

		if ( ! in_array( wp_remote_retrieve_response_code( $response ), [ 200, 201, 202, 204, 204 ], true ) ) {
			error_log( "Imajinn API Error: " . var_export( $body, true ) );

			//REST API error response
			if ( isset( $body->code ) ) {
				return new WP_Error( $body->code, $body->message );
			}

			return new WP_Error( 'api_error', esc_html__( "There was an unknown API error. Please try again.", 'imajinn-ai' ), [ 'status' => wp_remote_retrieve_response_code( $response ) ] );
		}

		error_log( 'HEADERS: ' . var_export( wp_remote_retrieve_headers( $response ), true ) );
		return $body;
	}

	public function get_api_key() {
		return get_site_option( 'imajinn_api_key' );
	}

	public function get_site_id() {
		return get_site_option( 'imajinn_site_id' );
	}

	public function get_site_data( $key ) {
		$data = get_site_option( 'imajinn_data' );
		if ( isset( $data[ $key ] ) ) {
			return $data[ $key ];
		}

		return false;
	}

	public function is_connected() {
		return $this->get_api_key() && $this->get_site_id();
	}

	private function update_data( $data ) {
		$data = (array) $data;

		//filter array
		$allowed_keys = [
			'remaining_credits',
			'total_images',
			'site_credits_used',
			'site_image_count',
		];
		$data         = array_intersect_key( $data, array_flip( $allowed_keys ) );

		update_site_option( 'imajinn_data', $data );
	}

	/**
	 * Perform a cap and CSRF check then return json params.
	 *
	 * @return mixed
	 */
	private function check_ajax() {
		// check caps
		if ( ! current_user_can( 'upload_files' ) ) {
			wp_send_json_error( new WP_Error( 'permissions', esc_html__( "You don't have permission to upload files.", 'imajinn-ai' ) ) );
		}

		$params = json_decode( file_get_contents( 'php://input' ), true );

		//check nonce
		if ( ! wp_verify_nonce( $params['nonce'], 'imajinn-ai' ) ) {
			wp_send_json_error( new WP_Error( 'nonce', esc_html__( 'Nonce verification failed. Refresh the page and try again.', 'imajinn-ai' ) ) );
		}

		return $params;
	}
}

Imajinn_AI::instance();
