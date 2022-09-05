<?php
// if uninstall.php is not called by WordPress, die
if ( ! defined( 'WP_UNINSTALL_PLUGIN' ) ) {
	die;
}

// delete options. We don't delete the imajinn_site_id, as we want to keep the site_id for the user to be able to re-connect another time to the same site.
delete_site_option( 'imajinn_api_key' );
delete_site_option( 'imajinn_data' );
