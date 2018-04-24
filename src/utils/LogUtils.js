export function logTransform(data, logCode) {
  const logCodeData = data.map(item => {
    const { code } = item;
    const { params } = item;
    let text = null;
    if (params) {
      params.map((value, key) => {
        let txt = value;
        text = logCode[code];
        const paramStr = txt ? txt.replace(/ /g, '_') : (txt = '');
        // 遍历参数---以防用户创建的资源与其他国际化名相同--最大化 保证 不会出现问题
        switch (paramStr) {
          case 'apply_config':
          case 'auto_create_site':
          case 'config_synchro_status':
          case 'cost_timing_statistics':
          case 'device_function_test':
          case 'evt_files':
          case 'flow_timing_statistics':
          case 'get_formatting_parameters':
          case 'import_upgrade_file':
          case 'inrouter_certificate_profile':
          case 'interactive_command':
          case 'periodic_cleaning_access_token':
          case 'remote_control':
          case 'run_config_apply':
          case 'sms_apply_config':
          case 'tendency_chart':
          case 'upload_files':
          case 'visit_timing_statistics':
          case 'vpn_link_order':
          case 'vpn_temporary_channel_config':
          case 'zip_format_config_file':
          case 'set_running_config':
          case 'get_running_config':
          case 'set_ovdp_config':
          case 'get_ovdp_config':
          case 'device_upgrade':
          case 'calculate_traffic':
          case 'inform_new_task':
          case 'check_channel_status':
          case 'calculate_bill':
          case 'calculate_api_access':
          case 'check_token_expired':
          case 'batch_favor':
          case 'batch_share':
          case 'batch_import_gateway_device':
          case 'download_template_file':
          case 'import_sn_file':
            text = logCode[paramStr];
            break;
          default:
            break;
        }
        if (text) {
          if (text.indexOf(`{${key}}`) > -1) {
            text = text.replace(`{${key}}`, txt);
          }
        }
        return null;
      });
    } else {
      text = logCode[code];
    }
    const resource = item;
    resource.content = text || resource.content;
    return resource;
  });
  return logCodeData;
}
