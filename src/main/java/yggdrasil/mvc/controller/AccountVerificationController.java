package yggdrasil.mvc.controller;

import javax.annotation.Resource;
import javax.transaction.Transactional;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;

import yggdrasil.dao.AccountVerificationDao;
import yggdrasil.dao.UserDao;
import yggdrasil.model.AccountVerification;

import com.mangofactory.swagger.annotations.ApiIgnore;

/**
 * This controller processes incoming account verification links.
 *
 * @author jason
 */
@Controller("verificationController")
@RequestMapping("/v")
@ApiIgnore
@Transactional
public class AccountVerificationController {
  @Resource
  private AccountVerificationDao verificationDao;

  @Resource
  private UserDao userDao;

  @RequestMapping(value = "/{verificationKey}")
  public String getVerificationPage(@PathVariable("verificationKey") final String verificationKey) {
    final AccountVerification verification = verificationDao.get(verificationKey);
    if (null == verification) {
      return "redirect:/page/error/verification?invalid";
    }
    if (verification.isExpired()) {
      return "redirect:/page/error/verification?expired";
    }
    verification.getUser().setEmailVerified(true);
    userDao.update(verification.getUser());
    verificationDao.delete(verificationKey);
    return "redirect:/page/verified";
  }
}
