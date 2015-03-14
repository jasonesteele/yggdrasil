package yggdrasil.mvc.controller;

import javax.annotation.Resource;
import javax.transaction.Transactional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;

import yggdrasil.dao.AccountVerificationDao;
import yggdrasil.dao.UserDao;
import yggdrasil.model.AccountVerification;
import yggdrasil.model.User;

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
  /** Class logger. */
  private static final Logger log = LoggerFactory.getLogger(AccountVerificationController.class);

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
    final User user = verification.getUser();
    user.setEmailVerified(true);

    userDao.update(verification.getUser());
    verificationDao.deleteVerificationsFor(user.getId());

    log.info("Verified user account " + user.getUsername() + " [email=" + user.getEmail()
        + "] : verification=" + verificationKey);

    return "redirect:/page/verified";
  }
}
